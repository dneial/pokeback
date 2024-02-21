import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { In, Like, Repository } from 'typeorm';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonType } from './entities/pokemontype.entity';

const URI = 'https://pokebuildapi.fr/api/v1/';

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(PokemonType)
    private readonly typeRepository: Repository<PokemonType>,
  ) {}

  async create(createPokemonInput: CreatePokemonInput) {
    const types = await this.typeRepository.find({
      where: { id: In(createPokemonInput.types) },
    });
    const poke = this.pokemonRepository.create(createPokemonInput);
    poke.types = types;
    return await this.pokemonRepository.save(poke);
  }

  async findAll(offset: number, limit: number): Promise<Pokemon[]> {
    const searchParams = {
      skip: offset,
      take: limit,
    };
    const bdPokes: Pokemon[] = await this.pokemonRepository.find(searchParams);

    offset |= 0;
    const apiOffset = offset - bdPokes.length < 0 ? 0 : offset - bdPokes.length;

    let url = URI + 'pokemon/';
    let apiLimit;

    if (limit >= 0) {
      limit -= bdPokes.length;
      if (limit < 0) {
        return bdPokes;
      }
      apiLimit = apiOffset + limit;
      url += `limit/${apiLimit}`;
    }
    const resp = await firstValueFrom(this.httpService.get(url).pipe());
    const apiPokes: Pokemon[] = await this.transformListData(resp.data);
    const offsetPokes = apiPokes.slice(apiOffset);
    const all = [...bdPokes, ...offsetPokes];

    return all;
  }

  async findOne(name: string): Promise<any> {
    const bdPokemon = await this.pokemonRepository.findOneBy({ name });
    if (bdPokemon) return bdPokemon;

    const url = URI + 'pokemon/' + name;
    try {
      const apiPoke = await firstValueFrom(this.httpService.get(url).pipe());
      const poke = (await this.transformListData([apiPoke.data])).at(0);
      return poke;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByType(types: string[]) {
    try {
      if (types.length > 2) return null;
      const bdPokemon = await this.pokemonRepository.find({
        where: { types: { name: In(types) } },
      });
      const url =
        URI +
        (types.length == 1
          ? `pokemon/type/${types[0]}`
          : `pokemon/types/${types[0]}/${types[1]}`);

      const resp = await firstValueFrom(this.httpService.get(url));
      const apiPokes = await this.transformListData(resp.data);

      return [...bdPokemon, ...apiPokes];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByName(name: string) {
    const bdPokes = await this.pokemonRepository.find({
      where: { name: Like(name) },
    });

    const res = await firstValueFrom(
      this.httpService.get(`${URI}pokemon`).pipe(),
    );
    const pokemon = (await this.transformListData(res.data)).filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    );
    return [...bdPokes, ...pokemon];
  }

  async getTypes(): Promise<PokemonType[]> {
    const types = await firstValueFrom(this.httpService.get(URI + 'types'));
    const pokeTypes = types.data.map((t) => ({ id: t.id, name: t.name }));
    return pokeTypes;
  }

  async update(updatePokemonInput: UpdatePokemonInput) {
    const pokemon = await this.pokemonRepository.findOneBy({
      id: updatePokemonInput.id,
    });
    if (!pokemon) return false;

    if (updatePokemonInput.types) {
      const types = await this.typeRepository.find({
        where: { id: In(updatePokemonInput.types) },
      });
      pokemon.types = types;
    }
    if (updatePokemonInput.attack) pokemon.attack = updatePokemonInput.attack;
    if (updatePokemonInput.defense)
      pokemon.defense = updatePokemonInput.defense;
    if (updatePokemonInput.speed) pokemon.speed = updatePokemonInput.speed;
    if (updatePokemonInput.hp) pokemon.hp = updatePokemonInput.hp;
    if (updatePokemonInput.imageURL)
      pokemon.imageURL = updatePokemonInput.imageURL;
    if (updatePokemonInput.evolutions)
      pokemon.evolutions = updatePokemonInput.evolutions;
    if (updatePokemonInput.name) pokemon.name = updatePokemonInput.name;
    if (updatePokemonInput.preEvolution)
      pokemon.preEvolution = updatePokemonInput.preEvolution;
    return !!(await this.pokemonRepository.save(pokemon));
  }

  async remove(id: string) {
    if (!id) return false;
    return (await this.pokemonRepository.delete(id)).affected >= 1;
  }

  async clear() {
    const deleted = await this.pokemonRepository.delete({});
    console.log(deleted.affected);
    return deleted.affected >= 1;
  }

  private transform(apiData): Pokemon {
    return {
      name: apiData.name,
      id: apiData.id,
      imageURL: apiData.image,
      hp: apiData.stats.HP,
      attack: apiData.stats.attack,
      defense: apiData.stats.defense,
      speed: apiData.stats.speed,
      types: apiData.apiTypes.map((t) => ({ name: t.name })),
      evolutions: apiData.apiEvolutions.map((p) => p.name),
      preEvolution: apiData.apiPreEvolution.name,
      userCreated: false,
    };
  }

  private async transformListData(apiData): Promise<Pokemon[]> {
    const pokemon: Pokemon[] = apiData.map(this.transform);

    const apiUniqueTypes = [
      ...new Set(pokemon.map((p) => p.types.map((t) => t.name)).flat()),
    ].flat();

    const types = await this.typeRepository.find({
      where: { name: In(apiUniqueTypes) },
    });

    for (const p of pokemon) {
      p.types = p.types.map((t) => ({
        id: types.find((tp) => tp.name === t.name).id,
        name: t.name,
      }));
    }

    return pokemon;
  }
}

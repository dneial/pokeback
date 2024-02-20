import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonType } from './entities/pokemontype.entity';

const URI = 'https://pokebuildapi.fr/api/v1/';

const transform = (apiData): Pokemon => {
  return {
    name: apiData.name,
    id: apiData.id,
    imageURL: apiData.image,
    hp: apiData.stats.HP,
    attack: apiData.stats.attack,
    defense: apiData.stats.defense,
    speed: apiData.stats.speed,
    types: apiData.apiTypes.map((t) => ({ id: t.id, name: t.name })),
    evolutions: apiData.apiEvolutions.map((p) => p.name),
    preEvolution: apiData.apiPreEvolution.name,
    userCreated: false,
  };
};

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
    const poke = this.pokemonRepository.create(createPokemonInput);
    return await this.pokemonRepository.save(poke);
  }

  async findAll(offset: number, limit: number): Promise<Pokemon[]> {
    const bdPokes: Pokemon[] = await this.pokemonRepository.find({
      skip: offset,
      take: limit,
      relations: {
        types: true,
      },
    });

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
    const apiPokes: Pokemon[] = resp.data.map((p) => transform(p));
    const offsetPokes = apiPokes.slice(apiOffset);
    const all = [...bdPokes, ...offsetPokes];

    return all;
  }

  async findOne(name: string): Promise<Pokemon> {
    const bdPokemon = await this.pokemonRepository.findOneBy({ name });
    if (bdPokemon) return bdPokemon;

    const url = URI + 'pokemon/' + name;
    try {
      const apiPoke = await firstValueFrom(this.httpService.get(url).pipe());
      return transform(apiPoke.data);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByType(type: string) {
    const resp = await firstValueFrom(
      this.httpService.get(URI + `pokemon/type/${type}`),
    );
    const apiPokes = resp.data.map((p) => transform(p));

    return apiPokes;
  }

  async getTypes(): Promise<PokemonType[]> {
    const types = await firstValueFrom(this.httpService.get(URI + 'types'));
    return types.data.map((t) => ({ id: t.id, name: t.name }));
  }

  async update(updatePokemonInput: UpdatePokemonInput) {
    // const update = await this.pokemonRepository.update(
    // { id: updatePokemonInput.id },
    // { ...updatePokemonInput },
    // );
    // return update.affected >= 1;
    return false;
  }

  async remove(id: string) {
    return (await this.pokemonRepository.delete(id)).affected >= 1;
  }
}

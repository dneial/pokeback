import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { Pokemon } from './entities/pokemon.entity';

const URI = 'https://pokebuildapi.fr/api/v1/pokemon/';

const transform = (apiData): Pokemon => {
  return {
    name: apiData.name,
    id: apiData.id,
    imageURL: apiData.image,
    hp: apiData.stats.HP,
    attack: apiData.stats.attack,
    defense: apiData.stats.defense,
    speed: apiData.stats.speed,
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
  ) {}

  async create(createPokemonInput: CreatePokemonInput) {
    const poke = this.pokemonRepository.create({ ...createPokemonInput });
    const inserted = await this.pokemonRepository.insert(poke);
    if (inserted.identifiers) return poke;
  }

  async findAll(offset: number, limit: number): Promise<Pokemon[]> {
    const bdPokes: Pokemon[] = await this.pokemonRepository.find({
      skip: offset,
      take: limit,
    });

    offset |= 0;
    const apiOffset = offset - bdPokes.length < 0 ? 0 : offset - bdPokes.length;

    let url = URI;
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

    const url = URI + name;
    try {
      const apiPoke = await firstValueFrom(this.httpService.get(url).pipe());
      return transform(apiPoke.data);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async update(updatePokemonInput: UpdatePokemonInput) {
    const update = await this.pokemonRepository.update(
      { id: updatePokemonInput.id },
      { ...updatePokemonInput },
    );
    return update.affected >= 1;
  }

  async remove(id: string) {
    return (await this.pokemonRepository.delete(id)).affected >= 1;
  }
}

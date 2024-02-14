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
  };
};

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  create(createPokemonInput: CreatePokemonInput) {
    return this.pokemonRepository.save({ ...createPokemonInput });
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

  update(id: string, updatePokemonInput: UpdatePokemonInput) {
    return this.pokemonRepository.update(id, { ...updatePokemonInput });
  }

  remove(id: string) {
    return this.pokemonRepository.delete(id);
  }
}

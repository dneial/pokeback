import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { Pokemon } from './entities/pokemon.entity';

const URI = 'https://pokebuildapi.fr/api/v1/pokemon/';

const transform = (apiData) => {
  return {
    name: apiData.name,
    id: apiData.id,
    imageURL: apiData.image,
    hp: apiData.stats.HP,
    attack: apiData.stats.attack,
    defense: apiData.stats.defense,
    speed: apiData.stats.speed,
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
    const name = createPokemonInput.name;
    const hp = createPokemonInput.hp;
    const attack = createPokemonInput.attack;
    const defense = createPokemonInput.defense;
    const speed = createPokemonInput.defense;
    const imageURL = createPokemonInput.imageURL || null;

    const poke = {
      name,
      imageURL,
      hp,
      attack,
      defense,
      speed,
    };

    return this.pokemonRepository.save(poke);
  }

  async findAll(offset: number, limit: number): Promise<Pokemon[]> {
    let bdPokes;
    if (!offset || offset === 0) {
      bdPokes = await this.pokemonRepository.find();
    }

    let url = URI;
    if (limit) {
      url += `limit/${limit}`;
    }
    const resp = await firstValueFrom(this.httpService.get(url).pipe());

    const apiPokes = resp.data.map((p) => transform(p));

    return offset ? apiPokes : bdPokes + apiPokes;
  }

  async findOne(name: string): Promise<Pokemon> {
    const bdPokemon = await this.pokemonRepository.findOneBy({ name });
    if (bdPokemon) return bdPokemon;

    const url = URI + name;
    try {
      const apiPoke = await firstValueFrom(this.httpService.get(url).pipe());
      return apiPoke.data.map((d) => transform(d));
    } catch (err) {
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

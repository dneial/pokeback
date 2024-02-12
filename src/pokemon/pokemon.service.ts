import { Injectable } from '@nestjs/common';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { Pokemon } from './entities/pokemon.entity';

const URI = 'https://pokeapi.co/api/v2/pokemon/';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  create(createPokemonInput: CreatePokemonInput) {
    return 'This action adds a new pokemon';
  }

  findAll(offset: number, limit: number): Observable<Pokemon[]> {
    const params = { offset: offset || 0, limit: limit || 2000 };
    return this.httpService
      .get(URI, { params })
      .pipe(
        map((r) =>
          r.data.results.map((v, idx) => ({ id: idx + 1, name: v.name })),
        ),
      );
  }

  findOne(id: number) {
    const url = URI + id;
    return this.httpService.get(url).pipe(map((v) => v.data));
  }

  update(id: number, updatePokemonInput: UpdatePokemonInput) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}

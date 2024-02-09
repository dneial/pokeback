import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { Pokemon } from 'src/models/pokemon';
const URI = 'https://pokeapi.co/api/v2/pokemon/';

@Injectable()
export class PokeService {
  constructor(private readonly httpService: HttpService) {}

  getPokemonCount(): Observable<AxiosResponse<number>> {
    return this.httpService
      .get(URI)
      .pipe(map((res) => res.data.count))
      .pipe(
        catchError((e) => {
          console.log(e);
          throw new Error('error');
        }),
      );
  }

  getAll(offset: number, limit: number): Observable<Pokemon[]> {
    const params = { offset: offset || 0, limit: limit || 2000 };
    return this.httpService
      .get(URI, { params })
      .pipe(
        map((r) =>
          r.data.results.map((v, idx) => ({ id: idx + 1, name: v.name })),
        ),
      );
  }

  getById(id: number) {
    const url = URI + id;
    return this.httpService.get(url).pipe(
      map((v) => v.data),
      map((data) => ({
        id: data.id,
        name: data.name,
        weight: data.weight,
        height: data.height,
        abilities: data.abilities.map((a) => a.ability.name),
        base_experience: data.base_experience,
        forms: data.forms.map((f) => f.name),
        moves: data.moves.map((m) => m.move.name),
        species: data.species.name,
        types: data.types.map((t) => t.type.name),
        order: data.order,
      })),
    );
  }
}

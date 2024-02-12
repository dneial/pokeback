import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { Pokemon } from './entities/pokemon.entity';
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

  getById(id: number): Observable<Pokemon> {
    const url = URI + id;
    return this.httpService.get(url).pipe(map((v) => v.data));
  }
}

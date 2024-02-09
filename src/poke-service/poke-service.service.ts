import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { Pokemon } from 'src/models/pokemon';
const uri = 'https://pokeapi.co/api/v2/pokemon/';

@Injectable()
export class PokeService {
  constructor(private readonly httpService: HttpService) {}

  getPokemonCount(): Observable<AxiosResponse<number>> {
    return this.httpService
      .get(uri)
      .pipe(map((res) => res.data.count))
      .pipe(
        catchError((e) => {
          console.log(e);
          throw new Error('error');
        }),
      );
  }

  getAll(params: object): Observable<AxiosResponse<Pokemon[]>> {
    return this.httpService
      .get(uri, { params })
      .pipe(map((r) => r.data.results));
  }
}

import { Args, Query, Resolver } from '@nestjs/graphql';
import { PokeService } from './poke-service/poke-service.service';

@Resolver('Poke')
export class PokeResolver {
  constructor(private readonly pokeService: PokeService) {}

  @Query('pokemons')
  async getPokemons(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    return this.pokeService.getAll(offset, limit);
  }

  @Query('pokemon')
  async getById(@Args('id') id: number) {
    return this.pokeService.getById(id);
  }
}

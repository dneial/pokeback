import { Args, Query, Resolver } from '@nestjs/graphql';
import { PokeService } from './poke-service.service';
import { Pokemon } from './entities/pokemon.entity';

@Resolver('Poke')
export class PokeResolver {
  constructor(private readonly pokeService: PokeService) {}

  @Query(() => Pokemon, { name: 'pokemons' })
  async getPokemons(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ) {
    return this.pokeService.getAll(offset, limit);
  }

  @Query(() => Pokemon, { name: 'pokemon' })
  async getById(@Args('id') id: number) {
    return this.pokeService.getById(id);
  }
}

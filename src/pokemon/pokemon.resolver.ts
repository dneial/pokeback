import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonService } from './pokemon.service';

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Pokemon)
  createPokemon(
    @Args('createPokemonInput') createPokemonInput: CreatePokemonInput,
  ) {
    return this.pokemonService.create(createPokemonInput);
  }

  @Query(() => [Pokemon], { name: 'pokemons' })
  findAll(
    @Args('offset', { type: () => Int, nullable: true }) offset: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
  ) {
    return this.pokemonService.findAll(offset, limit);
  }

  @Query(() => Pokemon, { name: 'pokemon', nullable: true })
  findOne(@Args('name', { type: () => String }) name: string) {
    return this.pokemonService.findOne(name);
  }

  @Mutation(() => Pokemon)
  updatePokemon(
    @Args('updatePokemonInput') updatePokemonInput: UpdatePokemonInput,
  ) {
    return this.pokemonService.update(
      updatePokemonInput.id,
      updatePokemonInput,
    );
  }

  @Mutation(() => Boolean)
  removePokemon(@Args('id', { type: () => String }) id: string) {
    return this.pokemonService.remove(id);
  }
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Pokemon)
  createPokemon(
    @Args('createPokemonInput') createPokemonInput: CreatePokemonInput,
  ) {
    return this.pokemonService.create(createPokemonInput);
  }

  @Query(() => [Pokemon], { name: 'pokemon' })
  findAll(
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ) {
    return this.pokemonService.findAll(offset, limit);
  }

  @Query(() => Pokemon, { name: 'pokemon' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.pokemonService.findOne(id);
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

  @Mutation(() => Pokemon)
  removePokemon(@Args('id', { type: () => Int }) id: number) {
    return this.pokemonService.remove(id);
  }
}

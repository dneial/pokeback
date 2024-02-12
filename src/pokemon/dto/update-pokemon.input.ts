import { CreatePokemonInput } from './create-pokemon.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePokemonInput extends PartialType(CreatePokemonInput) {
  @Field(() => Int)
  id: number;
}

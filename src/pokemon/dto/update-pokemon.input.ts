import { CreatePokemonInput } from './create-pokemon.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePokemonInput extends PartialType(CreatePokemonInput) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true })
  imageURL?: string;

  @Field(() => Int)
  hp?: number;

  @Field(() => Int)
  attack?: number;

  @Field(() => Int)
  defense?: number;

  @Field(() => Int)
  speed?: number;
}

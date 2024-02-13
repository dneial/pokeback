import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePokemonInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageURL: string;

  @Field(() => Int)
  hp: number;

  @Field(() => Int)
  attack: number;

  @Field(() => Int)
  defense: number;

  @Field(() => Int)
  speed: number;
}

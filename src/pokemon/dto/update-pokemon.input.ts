import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsOptional, IsUrl } from 'class-validator';
import { CreatePokemonInput } from './create-pokemon.input';

@InputType()
export class UpdatePokemonInput extends PartialType(CreatePokemonInput) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name?: string;

  @IsOptional()
  @IsUrl(undefined, { message: 'invalid URL' })
  @Field(() => String, { nullable: true })
  imageURL: string;

  @Field(() => Int)
  hp?: number;

  @Field(() => Int)
  attack?: number;

  @Field(() => Int)
  defense?: number;

  @Field(() => Int)
  speed?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  preEvolution: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  evolutions: string[];
}

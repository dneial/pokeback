import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsUrl } from 'class-validator';
import { PokemonType } from '../entities/pokemontype.entity';

@InputType()
export class CreatePokemonInput {
  @Field(() => String)
  name: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'invalid URL' })
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

  @Field(() => [Int])
  types: PokemonType[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  preEvolution: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  evolutions: string[];
}

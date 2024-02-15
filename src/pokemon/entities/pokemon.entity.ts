import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
const DEFAULT_IMAGE_URL =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/12ecb7ae-7059-48df-a4f8-2e3fb7858606/d47rmjf-de88a574-49c8-4dcf-9df4-7e11722e8bec.png/v1/fit/w_454,h_340,q_70,strp/who_s_that_pokemon__by_amitlu89_d47rmjf-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzQwIiwicGF0aCI6IlwvZlwvMTJlY2I3YWUtNzA1OS00OGRmLWE0ZjgtMmUzZmI3ODU4NjA2XC9kNDdybWpmLWRlODhhNTc0LTQ5YzgtNGRjZi05ZGY0LTdlMTE3MjJlOGJlYy5wbmciLCJ3aWR0aCI6Ijw9NDU0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Gg82YjPgXVwCwe3b1FVZnPvC8UtnL37AG9AqdPVzz50';
@Entity()
@ObjectType()
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ nullable: true, default: DEFAULT_IMAGE_URL })
  @Field({ nullable: true })
  imageURL: string;

  @Column()
  @Field()
  hp: number;

  @Column()
  @Field()
  attack: number;

  @Column()
  @Field()
  defense: number;

  @Column()
  @Field()
  speed: number;

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  evolutions: string[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  preEvolution: string;

  @Column({ default: true })
  @Field(() => Boolean)
  userCreated: boolean;
}

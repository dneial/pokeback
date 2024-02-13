import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field()
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

  @Column('simple-array')
  @Field(() => [String], { nullable: true })
  evolutions: string[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  preEvolution: string;
}

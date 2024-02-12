import { Field } from '@nestjs/graphql';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  name: string;

  @Column({ type: 'int' })
  @Field()
  weight: number;

  @Column({ type: 'int' })
  @Field()
  height: number;
}

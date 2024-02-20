import { DataSource } from 'typeorm';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { PokemonType } from './pokemon/entities/pokemontype.entity';

export const ds = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: true,
  entities: [Pokemon, PokemonType],
  migrations: ['./pokemon/migrations/**'],
  host: 'localhost',
  port: 5432,
  password: 'azerty',
  username: 'postgres',
  database: 'pokemon',
});

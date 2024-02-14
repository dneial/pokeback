import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    PokemonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'postgres',
      synchronize: true,
      logging: true,
      entities: [Pokemon],
      host: 'localhost',
      port: 5432,
      password: 'azerty',
      username: 'postgres',
      database: 'pokemon',
    }),
  ],
})
export class AppModule {}

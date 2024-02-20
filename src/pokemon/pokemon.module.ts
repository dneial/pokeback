import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonType } from './entities/pokemontype.entity';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Pokemon, PokemonType])],
  providers: [PokemonResolver, PokemonService],
})
export class PokemonModule {}

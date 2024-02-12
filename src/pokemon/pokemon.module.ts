import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonResolver } from './pokemon.resolver';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Pokemon])],
  providers: [PokemonResolver, PokemonService],
})
export class PokemonModule {}

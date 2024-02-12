import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokeResolver } from './poke.resolver';
import { PokeService } from './poke-service.service';

@Module({
  imports: [HttpModule],
  providers: [PokeResolver, PokeService],
})
export class PokeModule {}

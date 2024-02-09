import { Controller, Get, Param } from '@nestjs/common';
import { PokeService } from 'src/poke-service/poke-service.service';

@Controller('pokemons')
export class PokeController {
  constructor(private readonly pokeService: PokeService) {}

  @Get('/count')
  getCount() {
    return this.pokeService.getPokemonCount();
  }

  @Get()
  getAll(@Param('page') page: number, @Param('count') count: number) {
    if (!page) {
      page = 0;
    }
    if (!count) {
      count = 1302;
    }
    return this.pokeService.getAll({ offset: page * count, limit: count });
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokeController } from './poke-controller/poke-controller.controller';
import { PokeService } from './poke-service/poke-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, PokeController],
  providers: [AppService, PokeService],
})
export class AppModule {}

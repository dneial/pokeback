import { Test, TestingModule } from '@nestjs/testing';
import { PokeControllerController } from './poke-controller.controller';

describe('PokeControllerController', () => {
  let controller: PokeControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokeControllerController],
    }).compile();

    controller = module.get<PokeControllerController>(PokeControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

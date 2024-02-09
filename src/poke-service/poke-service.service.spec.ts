import { Test, TestingModule } from '@nestjs/testing';
import { PokeServiceService } from './poke-service.service';

describe('PokeServiceService', () => {
  let service: PokeServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeServiceService],
    }).compile();

    service = module.get<PokeServiceService>(PokeServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

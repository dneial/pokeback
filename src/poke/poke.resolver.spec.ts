import { Test, TestingModule } from '@nestjs/testing';
import { PokeResolver } from './poke.resolver';

describe('PokeResolver', () => {
  let resolver: PokeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeResolver],
    }).compile();

    resolver = module.get<PokeResolver>(PokeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

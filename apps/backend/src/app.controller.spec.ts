import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return service metadata', () => {
      const result = appController.root();
      expect(result).toMatchObject({
        service: 'signal-lab-backend',
        docs: '/api/docs',
        health: '/api/health',
      });
    });
  });
});

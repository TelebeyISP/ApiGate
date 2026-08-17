import { Test, TestingModule } from '@nestjs/testing';
import { Open5gsController } from './open5gs.controller';
import { Open5gsSubscriberService } from './open5gs.service';

describe('Open5gsController', () => {
  let controller: Open5gsController;
  const open5gs = {
    getStatus: jest.fn().mockResolvedValue({
      mongodb: { connected: true, subscriberCount: 1 },
      webui: { reachable: true },
      core: 'open5gs',
    }),
    listSubscribers: jest.fn().mockResolvedValue([{ imsi: '001010000000001' }]),
    getSubscriber: jest.fn().mockResolvedValue({ imsi: '001010000000001' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Open5gsController],
      providers: [{ provide: Open5gsSubscriberService, useValue: open5gs }],
    }).compile();

    controller = module.get(Open5gsController);
  });

  it('returns network status', async () => {
    await expect(controller.getStatus()).resolves.toMatchObject({ core: 'open5gs' });
  });

  it('lists subscribers', async () => {
    await expect(controller.listSubscribers('10')).resolves.toEqual([
      { imsi: '001010000000001' },
    ]);
    expect(open5gs.listSubscribers).toHaveBeenCalledWith(10);
  });

  it('fetches a subscriber by IMSI', async () => {
    await expect(controller.getSubscriber('001010000000001')).resolves.toEqual({
      imsi: '001010000000001',
    });
  });
});

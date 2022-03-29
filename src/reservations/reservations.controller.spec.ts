import { Test, TestingModule } from '@nestjs/testing';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

const mockReservationsRepository = () => ({
  getReservationsresponse: jest.fn(),
  find: jest.fn(),
});

describe('ReservationsController', () => {
  let reservationsController: ReservationsController;
  let reservationsService: ReservationsService;

  beforeEach(async () => {
    reservationsController = new ReservationsController(reservationsService);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useFactory: mockReservationsRepository,
        },
      ],
    }).compile();
    reservationsController = module.get<ReservationsController>(
      ReservationsController,
    );
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  describe('getReservationsResponse', () => {
    it('should return an array of Reservations', async () => {
      const mockReservation: Reservation = {
        id: 'someId',
        startTime: 'someTime',
        endTime: 'someTime',
        email: 'someEmail',
        phone: 'phoneNumber',
        pushNotificationKey: 'someKey',
        receiveEmail: false,
        receiveSmsNotification: false,
        receivePushNotification: false,
        createdTime: 'someTime',
        status: ReservationStatus.REQUESTED,
      };
      const result: Reservation[] = [mockReservation];

      const getReservationsOnService = jest.spyOn(
        reservationsService,
        'getReservationsResponse',
      );
      getReservationsOnService.mockResolvedValue(result);

      expect(await reservationsController.getReservationsResponse()).toBe(
        result,
      );
    });
  });
});

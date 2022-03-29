import { Test, TestingModule } from '@nestjs/testing';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

const mockReservationRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockReservation = {
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

describe('CallsService', () => {
  let reservationService: ReservationsService;
  let reservationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useFactory: mockReservationRepository,
        },
      ],
    }).compile();

    reservationService = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get(ReservationsRepository);
  });

  it('should be defined', () => {
    expect(reservationService).toBeDefined();
  });

  describe('getSingleReservationResponse', () => {
    it('calls reservationRepository.findOne and return a result', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      const result = await reservationService.getSingleReservationResponse(
        'someId',
      );
      expect(result).toEqual(mockReservation);
    });
  });

  describe('getReservationsResponse', () => {
    it('calls getReservationsResponse and return a result', async () => {
      const result: Reservation[] = [mockReservation];
      reservationRepository.find.mockResolvedValue(result);
      expect(await reservationService.getReservationsResponse()).toBe(result);
    });
  });
});

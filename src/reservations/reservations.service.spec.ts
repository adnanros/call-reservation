import { Global, MethodNotAllowedException, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SchedulersRepository } from '../schedulers/schedulers.repository';
import { SchedulersService } from '../schedulers/schedulers.service';
import { SchedulersModule } from '../schedulers/schedulers.module';
import { Email } from './email.service';
import { ReservationStatus } from './reservation-status.enum';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Global()
@Module({
  providers: [
    {
      provide: SchedulersService,
      useValue: {}
    },
    {
      provide: SchedulersRepository,
      useValue: {}
    }
  ],
  exports: [SchedulersService]
})
class TestSchedulerModule {}

const mockReservationRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});
const mockSchedulersRepository = () => ({});

const mockReservation = new Reservation();
mockReservation.id = 'someId';
mockReservation.status = ReservationStatus.REQUESTED;

describe('ReservationsService', () => {
  let reservationService: ReservationsService;
  let reservationRepository;

  beforeEach(async () => {
   
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestSchedulerModule],
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useFactory: mockReservationRepository,
        },
        Email,
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

  describe('acceptReservationByAdmin ', () => {
    beforeEach(() => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
    });

    it('get a reservation with REQUESTED status and updates its status to ACCEPTED', async () => {
      const result = new Reservation();
      result.id = 'someId';
      result.status = ReservationStatus.ACCEPTED;

      reservationRepository.save.mockResolvedValue(result);

      expect(
        await reservationService.acceptReservationByAdmin(mockReservation.id),
      ).toEqual(result);
    });

    it('get a reservation with status that is not REQUESTED and throw Exception', async () => {
      const someReservation = new Reservation();
      someReservation.id = 'someId';
      someReservation.status = ReservationStatus.ACCEPTED;

      try {
        await reservationService.acceptReservationByAdmin(someReservation.id);
      } catch (error) {
        expect(error).toEqual(
          new MethodNotAllowedException(
            'Action is not allowed for this reservation',
          ),
        );
      }
    });
  });

  describe('rejectReservationByAdmin ', () => {
    it('get a reservation with REQUESTED or ACCEPTED status and updates its status to rejected', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);

      const result = new Reservation();
      result.id = 'someId';
      result.status = ReservationStatus.REJECTED;

      reservationRepository.save.mockResolvedValue(result);

      expect(
        await reservationService.rejectReservationByAdmin(mockReservation.id),
      ).toEqual(result);
    });

    it('get a reservation with status that is DONE and throw Exception', async () => {
      const someReservation = new Reservation();
      someReservation.id = 'someId';
      someReservation.status = ReservationStatus.DONE;
      reservationRepository.findOne.mockResolvedValue(someReservation);

      try {
        await reservationService.rejectReservationByAdmin(someReservation.id);
      } catch (error) {
        expect(error).toEqual(
          new MethodNotAllowedException(
            'The target reservation is done already',
          ),
        );
      }
    });
  });

  describe('updateReservationTime', () => {
    it('get a reservation which is not having status DONE or ONGOING', async () => {
      const result = new Reservation();
      result.id = 'someId';
      const newStartTime = Date.now() + 50000;
      result.startTime = newStartTime.toString();
      result.status = ReservationStatus.REQUESTED;
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      reservationRepository.save.mockResolvedValue(result);

      expect(
        await reservationService.updateReservationTime(
          mockReservation.id,
          newStartTime.toString(),
        ),
      ).toEqual(result);
    });
  });
});

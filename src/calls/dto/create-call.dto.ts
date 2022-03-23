import { IsNotEmpty } from 'class-validator';

export class CreateCallDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  callTime: string;
}

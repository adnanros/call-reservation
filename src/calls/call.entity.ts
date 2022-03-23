/* eslint-disable prettier/prettier */
import { CallStatus } from './call-status.enum';
export class Call {
  id: string;
  description: string;
  callTime: string;
  status: CallStatus;
}

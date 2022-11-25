import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello !';
  }
  getUser(id: string): string {
    return `User Id: ${id}`;
  }
}

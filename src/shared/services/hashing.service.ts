import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashingService {
  private SALT_ROUNDS = 10;

  hash(value: string): Promise<string> {
    return hash(value, this.SALT_ROUNDS);
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}

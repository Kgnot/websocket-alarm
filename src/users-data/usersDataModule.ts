import { Module } from '@nestjs/common';
import { UsersDataService } from './usersDataService';

@Module({
  providers: [UsersDataService]
})
export class UsersDataModule {



}

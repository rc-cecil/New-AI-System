import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerController } from './worker.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [WorkerController],
  providers: [],
})
export class AppModule {}

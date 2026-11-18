import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { ActivityEntity } from './activity.entity';
import { ActivitiesService } from './activities.service';
import { ActivityController } from './activity.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([ActivityEntity]),
  ],
  controllers: [ActivityController],
  providers: [ActivitiesService],
})
export class ActivityServiceModule {}

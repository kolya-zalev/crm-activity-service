import { Injectable } from '@nestjs/common';
import { activityTypes } from '@crm/shared';
import type {
  ActivityDto,
  ActivityType,
  Actor,
  LeadAssignedEvent,
  LeadClosedEvent,
  LeadCreatedEvent,
  LeadDeletedEvent,
  LeadIdPayload,
  LeadUnassignedEvent,
  LeadUpdatedEvent,
  NoteAddedEvent,
  NoteDeletedEvent,
} from '@crm/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { RecordActivityInput, toActivityDto } from './activities.mapper';

const UNASSIGNED = 'Unassigned';

type ActivityEvent = { leadId: string; actor: Actor; occurredAt: string };

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly repo: Repository<ActivityEntity>,
  ) {}

  async findByLead({ leadId }: LeadIdPayload): Promise<ActivityDto[]> {
    const activities = await this.repo.find({
      where: { leadId },
      order: { createdAt: 'DESC' },
    });
    return activities.map(toActivityDto);
  }

  async record(input: RecordActivityInput): Promise<void> {
    const { leadId, type, description, actor, occurredAt } = input;

    const activity = this.repo.create({
      leadId,
      type,
      description,
      userId: actor.id,
      userName: actor.name,
      createdAt: new Date(occurredAt),
    });

    await this.repo.save(activity);
  }

  async removeByLead({ leadId }: LeadDeletedEvent): Promise<void> {
    await this.repo.delete({ leadId });
  }

  leadCreated(event: LeadCreatedEvent): Promise<void> {
    return this.fromEvent(event, activityTypes.leadCreated, 'Lead was created');
  }

  statusChanged(event: LeadClosedEvent): Promise<void> {
    return this.fromEvent(
      event,
      activityTypes.statusChanged,
      `${event.previousStatus} → ${event.status}`,
    );
  }

  assigned(event: LeadAssignedEvent): Promise<void> {
    return this.fromEvent(
      event,
      activityTypes.assigned,
      `${event.previousAssigneeName ?? UNASSIGNED} → ${event.assignedName}`,
    );
  }

  unassigned(event: LeadUnassignedEvent): Promise<void> {
    return this.fromEvent(
      event,
      activityTypes.assigned,
      `${event.previousAssigneeName ?? UNASSIGNED} → ${UNASSIGNED}`,
    );
  }

  leadUpdated(event: LeadUpdatedEvent): Promise<void> {
    return this.fromEvent(event, activityTypes.leadUpdated, 'Lead was updated');
  }

  noteAdded(event: NoteAddedEvent): Promise<void> {
    return this.fromEvent(event, activityTypes.noteAdded, 'Note added');
  }

  noteDeleted(event: NoteDeletedEvent): Promise<void> {
    return this.fromEvent(event, activityTypes.noteDeleted, 'Note deleted');
  }

  private fromEvent(
    { leadId, actor, occurredAt }: ActivityEvent,
    type: ActivityType,
    description: string,
  ): Promise<void> {
    return this.record({ leadId, actor, occurredAt, type, description });
  }
}

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  activitiesMessages,
  eventsNotifications,
  leadsEvents,
} from '@crm/shared';
import type {
  ActivityDto,
  LeadAssignedEvent,
  LeadClosedEvent,
  LeadCreatedEvent,
  LeadDeletedEvent,
  LeadIdPayload,
  LeadStatusChangedEvent,
  LeadUnassignedEvent,
  LeadUpdatedEvent,
  NoteAddedEvent,
  NoteDeletedEvent,
} from '@crm/shared';
import { ActivitiesService } from './activities.service';

@Controller()
export class ActivityController {
  private readonly logger = new Logger(ActivityController.name);

  constructor(private readonly activitiesService: ActivitiesService) {}


  @MessagePattern(activitiesMessages.activitiesFindByLead)
  findByLead(@Payload() payload: LeadIdPayload): Promise<ActivityDto[]> {
    return this.activitiesService.findByLead(payload);
  }


  @EventPattern(leadsEvents.leadCreated)
  handleLeadCreated(@Payload() event: LeadCreatedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.leadCreated, () =>
      this.activitiesService.leadCreated(event),
    );
  }

  @EventPattern(eventsNotifications.leadStatusChanged)
  handleLeadStatusChanged(
    @Payload() event: LeadStatusChangedEvent,
  ): Promise<void> {
    return this.safely(
      event.leadId,
      eventsNotifications.leadStatusChanged,
      () => this.activitiesService.statusChanged(event),
    );
  }

  @EventPattern(eventsNotifications.leadClosed)
  handleLeadClosed(@Payload() event: LeadClosedEvent): Promise<void> {
    return this.safely(event.leadId, eventsNotifications.leadClosed, () =>
      this.activitiesService.statusChanged(event),
    );
  }

  @EventPattern(eventsNotifications.leadAssigned)
  handleLeadAssigned(@Payload() event: LeadAssignedEvent): Promise<void> {
    return this.safely(event.leadId, eventsNotifications.leadAssigned, () =>
      this.activitiesService.assigned(event),
    );
  }

  @EventPattern(leadsEvents.leadUnassigned)
  handleLeadUnassigned(@Payload() event: LeadUnassignedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.leadUnassigned, () =>
      this.activitiesService.unassigned(event),
    );
  }

  @EventPattern(leadsEvents.leadUpdated)
  handleLeadUpdated(@Payload() event: LeadUpdatedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.leadUpdated, () =>
      this.activitiesService.leadUpdated(event),
    );
  }

  @EventPattern(leadsEvents.noteAdded)
  handleNoteAdded(@Payload() event: NoteAddedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.noteAdded, () =>
      this.activitiesService.noteAdded(event),
    );
  }

  @EventPattern(leadsEvents.noteDeleted)
  handleNoteDeleted(@Payload() event: NoteDeletedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.noteDeleted, () =>
      this.activitiesService.noteDeleted(event),
    );
  }

  @EventPattern(leadsEvents.leadDeleted)
  handleLeadDeleted(@Payload() event: LeadDeletedEvent): Promise<void> {
    return this.safely(event.leadId, leadsEvents.leadDeleted, () =>
      this.activitiesService.removeByLead(event),
    );
  }

  private async safely(
    leadId: string,
    event: string,
    handler: () => Promise<void>,
  ): Promise<void> {
    try {
      await handler();
    } catch (error) {
      this.logger.error(
        `Failed to handle ${event} for lead ${leadId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}

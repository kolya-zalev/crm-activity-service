import type { ActivityDto, ActivityType, Actor } from '@crm/shared';
import { ActivityEntity } from './activity.entity';

export const toActivityDto = (row: ActivityEntity): ActivityDto => ({
  id: row.id,
  leadId: row.leadId,
  createdAt: row.createdAt.toISOString(),
  type: row.type,
  description: row.description,
  userId: row.userId,
  userName: row.userName,
});

export interface RecordActivityInput {
  leadId: string;
  type: ActivityType;
  description: string;
  actor: Actor;
  occurredAt: string;
}

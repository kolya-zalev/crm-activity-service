import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Activity')
@Index(['leadId'])
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  leadId: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  userId: string | null;

  @Column({ type: 'text', default: '' })
  userName: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;
}

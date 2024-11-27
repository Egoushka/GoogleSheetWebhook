import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Row {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

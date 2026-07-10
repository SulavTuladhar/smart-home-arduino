import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("motion_events")
export class MotionEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  deviceId!: string | null;

  @Column({ type: "varchar", nullable: true })
  room!: string | null;

  @Column("boolean", { nullable: true })
  motion!: boolean | null;

  @Column("int", { nullable: true })
  count!: number | null;

  @Column("boolean", { nullable: true })
  lightsOn!: boolean | null;

  @Column("varchar", { nullable: true })
  uptime!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

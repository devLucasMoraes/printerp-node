import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export class Setting {
  @PrimaryColumn({ type: "varchar", length: 255 })
  key: string;

  @Column({ type: "text" })
  value: string;

  @Column({ name: "user_id", type: "varchar", length: 255 })
  userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}

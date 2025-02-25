import { compare, hash } from "bcrypt";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { authConfig } from "../../config/auth";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({
    name: "token_version",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  tokenVersion: string | null;

  @Column({ name: "user_id", type: "varchar", length: 255, nullable: true })
  userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  async hashPassword() {
    this.password = await hash(this.password, authConfig.saltRounds);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await compare(plainPassword, this.password);
  }

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

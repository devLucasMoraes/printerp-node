import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RequisicaoEstoque } from "./RequisicaoEstoque";

@Entity("requisitantes")
export class Requisitante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  nome: string;

  @Column({ type: "varchar", length: 255 })
  fone: string;

  @Column({ type: "boolean", default: true })
  ativo: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255, nullable: true })
  userId: string;

  @OneToMany(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.requisitante
  )
  requisicoes: RequisicaoEstoque[];

  constructor(data?: Partial<Requisitante>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

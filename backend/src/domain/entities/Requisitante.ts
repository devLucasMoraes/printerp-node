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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

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

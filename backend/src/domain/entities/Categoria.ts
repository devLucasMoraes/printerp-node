import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Insumo } from "./Insumo";

@Entity("categorias")
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  nome: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255, nullable: true })
  userId: string;

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];

  constructor(data?: Partial<Categoria>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

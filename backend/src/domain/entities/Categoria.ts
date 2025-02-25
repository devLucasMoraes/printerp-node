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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];

  constructor(data?: Partial<Categoria>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column("int", { default: 0 })
  tokenVersion!: number;
}

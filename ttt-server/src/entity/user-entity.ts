import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column("int", { default: 0 })
  tokenVersion!: number;
}

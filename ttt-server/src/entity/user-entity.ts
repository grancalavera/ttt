import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { UserId } from "model";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id!: UserId;

  @Column("int", { default: 0 })
  tokenVersion!: number;
}

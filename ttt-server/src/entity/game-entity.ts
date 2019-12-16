import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("games")
export class GameEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  O?: string;

  @Column({ nullable: true })
  X?: string;
}

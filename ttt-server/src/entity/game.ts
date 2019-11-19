import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("games")
export class Game extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  oId?: number;

  @Column({ nullable: true })
  xId?: number;
}

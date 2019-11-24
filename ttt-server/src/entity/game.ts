import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("games")
export class Game extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  O?: string;

  @Column({ nullable: true })
  X?: string;

  @Column({ nullable: true })
  next?: string;
}

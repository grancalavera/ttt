import { GameResult } from "generated/graphql";
import { Typename } from "model";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("games")
export class GameEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  state!: Typename<GameResult>;

  @Column({ nullable: true })
  O?: string;

  @Column({ nullable: true })
  X?: string;

  @Column({ nullable: true })
  next?: "O" | "X";
}

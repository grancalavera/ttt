import { GameStatus } from "generated/graphql";
import { Typename } from "model";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { UserId } from "./types";

@Entity("games")
export class GameEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  status!: Typename<GameStatus>;

  @Column({ nullable: true })
  O?: UserId;

  @Column({ nullable: true })
  X?: UserId;

  @Column({ nullable: true })
  next?: "O" | "X";

  @Column({ nullable: true })
  winner?: "O" | "X";
}

import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity("games")
export class Game extends BaseEntity {
  @PrimaryColumn()
  id!: string;
}

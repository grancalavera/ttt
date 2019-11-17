import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@ObjectType()
// @Entity("games")
export class Game extends BaseEntity {
  @Field(() => String)
  // @PrimaryColumn()
  id!: string;
}

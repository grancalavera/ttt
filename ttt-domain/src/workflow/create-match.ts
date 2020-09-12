import { failure, isSuccess, success } from "@grancalavera/ttt-etc"
import { Match, New } from "../domain/model"
import { CreateMatchWorkflow } from "./support"

export const createMatch: CreateMatchWorkflow = (dependencies) => async (
  input,
) => {
  const { getUniqueId, upsertMatch } = dependencies
  const { owner } = input

  const match: Match = {
    id: getUniqueId(),
    owner,
    state: applyStateTransition(),
  }

  const result = await upsertMatch(match)
  return isSuccess(result) ? success(match) : failure([result.error])
}

const applyStateTransition = (): New => ({ kind: "New" })

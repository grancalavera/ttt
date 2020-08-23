// https://stackoverflow.com/questions/56513652/extend-union-type
export interface WorkflowErrorMap {}
export type WorkflowError = WorkflowErrorMap[keyof WorkflowErrorMap];

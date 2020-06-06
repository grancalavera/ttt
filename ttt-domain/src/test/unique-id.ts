import { UniqueIdProducer } from "model";

export const constantUniqueIdProducer = (id: string): UniqueIdProducer => ({
  getUniqueId: () => id,
});

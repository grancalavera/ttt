import { app } from "./app";
import { store } from "./store";

const port = 5000;

store.sync().then(() => {
  app.listen(port, () => {
    console.log(`server started at  http://localhost:${port}`);
  });
});

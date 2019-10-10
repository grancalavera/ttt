import { app } from "./app";
import { create } from "./store";

const port = 5000;

create("store.sqlite")
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`server started at  http://localhost:${port}/ttt`);
    });
  });

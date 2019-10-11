import { mkApp } from "./app";
import { create } from "./store";

const port = 5000;
const baseUrl = "/ttt";

create("store.sqlite")
  .sync()
  .then(() => {
    mkApp(baseUrl).listen(port, () => {
      console.log(`server started at  http://localhost:${port}${baseUrl}`);
    });
  });

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import View from "./view";

const app = new Hono({ strict: false });

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/page", (c) => {
  return c.html(View);
});

app.use(
  "/static/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/static/, "/statics"),
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`);
    },
  }),
);

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

export default {
  port: 3000,
  fetch: app.fetch,
};

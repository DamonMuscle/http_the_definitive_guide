const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const koa = require("koa");
const { findAvailablePort } = require("../../../utils");

findAvailablePort().then((port) => {
  const app = new koa();

  app.use(async (ctx, next) => {
    if (ctx.req.url == "/favicon.ico") {
      ctx.body = "";
      ctx.status = 200;
      return;
    }

    if (ctx.req.url == "/" && ctx.req.method == "GET") {
      ctx.body = fs.readFileSync(path.resolve(__dirname, "index.html"), {
        encoding: "utf8",
      });
      ctx.status = 200;
      ctx.set("content-type", "text/html");
      return;
    }

    if (ctx.req.url == "/" && ctx.req.method == "POST") {
      const form = formidable({ multiples: true });

      await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }

          ctx.set("Content-Type", "application/json");
          ctx.status = 200;
          ctx.state = { fields, files };
          ctx.body = JSON.stringify(ctx.state, null, 2);
          resolve();
        });
      });
      await next();
      return;
    }
  });

  app.listen(port, () => {
    console.log("App is running at http://localhost:%d", port);
    console.log("Press CTRL-C to stop");
  });
});

const fs = require("fs");
const path = require("path");
const koa = require("koa");
const { findAvailablePort } = require("../../../utils");

findAvailablePort().then((port) => {
  const app = new koa();

  app.use(async (ctx) => {
    if (ctx.req.url == "/") {
      ctx.set("Location", "1.html");
      ctx.status = 301;
      return;
    }

    if (ctx.req.url == "/1.html") {
      ctx.set("Location", "2.html");
      ctx.status = 301;
      return;
    }

    if (ctx.req.url == "/2.html") {
      ctx.body = fs.readFileSync(path.resolve(__dirname, "2.html"));
      ctx.set("content-type", "text/html");
      ctx.status = 200;
    }
  });

  app.listen(port, () => {
    console.log("App is running at http://localhost:%d", port);
    console.log("Press CTRL-C to stop\n");
  });
});

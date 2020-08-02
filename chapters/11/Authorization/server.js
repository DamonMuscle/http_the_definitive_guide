const fs = require("fs");
const path = require("path");
const koa = require("koa");
const { findAvailablePort } = require("../../../utils");

findAvailablePort().then((port) => {
  const app = new koa();

  app.use(async (ctx) => {
    if (ctx.req.url == "/favicon.ico") {
      ctx.body = "";
      ctx.status = 200;
      return;
    }

    const authInfo =
      (ctx.req.headers["authorization"] || "").split(" ")[1] || "";

    if (ctx.req.url == "/" && !authInfo) {
      ctx.set("WWW-authenticate", 'Basic realm="123"');
      ctx.status = 401;
      return;
    }

    const [userName, password] = Buffer.from(authInfo, "base64")
      .toString()
      .split(":");

    ctx.body = `username: ${userName}, password: ${password}`;
    ctx.status = 200;
    ctx.set("content-type", "text/html");
  });

  app.listen(port, () => {
    console.log("App is running at http://localhost:%d", port);
    console.log("Press CTRL-C to stop");
  });
});

var net = require("net");
var fs = require("fs");
var path = require("path");
var NodeRSA = require("node-rsa");

function checkPort(port) {
  return new Promise(function (resolve) {
    var server = net.createServer().listen(port);

    server.on("listening", function () {
      server.close();
      resolve(true);
    });

    server.on("error", function (err) {
      resolve(false);
    });
  });
}

module.exports = {
  findAvailablePort: async function (port = 80) {
    while (true) {
      if (await checkPort(port)) {
        return port;
      }

      port++;
    }
  },
  generateSSLKeys: function () {
    return new Promise(function (resolve) {
      var key = new NodeRSA(2048);

      fs.writeFileSync(
        path.join(process.cwd(), "private.key"),
        key.exportKey("private")
      );
      fs.writeFileSync(
        path.join(process.cwd(), "public.key"),
        key.exportKey("public")
      );

      resolve();
    });
  },
};

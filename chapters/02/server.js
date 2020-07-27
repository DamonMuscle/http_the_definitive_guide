/**
 * <scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag></frag>
 * http://damon:damon123@www.damon.com:80/products;owner=damon/index.html?date=20200729
 */
const http = require("http");
const { findAvailablePort } = require("../../utils");

findAvailablePort().then(function (port) {
  http
    .createServer(function (req, res) {
      res.end();
    })
    .listen(port, () => {
      console.log(`Running @ http://localhost:${port}`);
    });
});

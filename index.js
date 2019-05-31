var express = require("express");
var app = express();
var utils = require("./src/utils");
var path = require("path");

utils.checkPort(80).then(function(valid)
{
	app.set("port", valid ? 80 : 3000);
	app.get("/favicon.ico", function(req, res, next)
	{
		res.sendFile(path.join(__dirname, "favicon.ico"));
	})
	// var registerRoute = require("./src/chapter03/status_301/worker");
	// var registerRoute = require("./src/chapter12/basic-authenticate");

	var registerRoute = require("./src/chapter11/cookie");
	registerRoute(app);

	app.listen(app.get("port"), () =>
	{
		console.log("App is running at http://localhost:%d", app.get("port"));
		console.log("  Press CTRL-C to stop\n");
	});
})

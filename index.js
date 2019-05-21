var express = require("express");
var app = express();
var utils = require("./src/utils");

utils.checkPort(80).then(function(valid)
{
	app.set("port", valid ? 80 : 3000);

	var registerRoute = require("./src/chapter03/status_301/worker");
	registerRoute(app);

	app.listen(app.get("port"), () =>
	{
		console.log("App is running at http://localhost:%d", app.get("port"));
		console.log("  Press CTRL-C to stop\n");
	});
})

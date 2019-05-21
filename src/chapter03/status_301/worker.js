var path = require("path");

module.exports = function(app)
{
	app.get("/1.html", function(req, res, next)
	{
		res.setHeader("Location", "/2.html");
		res.sendStatus(301);
		next();
	});

	app.get("/2.html", function(req, res, next)
	{
		res.sendFile(path.join(__dirname, "2.html"));
	});
}
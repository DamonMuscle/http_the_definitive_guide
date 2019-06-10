module.exports = function(app)
{
	app.get("/", function(req, res, next)
	{
		// res.set("Content-Type", "text/html; charset=iso-8859-6");
		// res.set("Content-Language", "ar");
		res.send("ف");
	});
}
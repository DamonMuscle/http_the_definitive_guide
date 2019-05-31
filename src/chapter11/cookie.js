module.exports = function(app)
{
	app.get("/", function(req, res, next)
	{
		var cookie = req.get("cookie") || "";
		if (!cookie)
		{
			res.set("Set-cookie2", "id=10086");
		}
		else
		{
			cookie = `id=${+(cookie.split("=")[1]) + 1}`;
			res.set("Set-cookie2", cookie);
		}
		res.send("Welcome!")
	});
}
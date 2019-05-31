module.exports = function(app)
{
	app.get("/", function(req, res, next)
	{
		var authorization = (req.get("Authorization") || "").split(" ")[1];

		if (!authorization)
		{
			res.set("WWW-authenticate", "Basic relam=\"STOP!\"");
			res.status(401).send("Login Reqiured!!")
		}
		else
		{
			var [userName, password] = getNameAndPassword(authorization);
			res.send(`welcome ${userName}, and your password is ${password}`);
		}
	});

	function base64ToString(base64Str)
	{
		return new Buffer(base64Str, 'base64').toString();
	}

	function getNameAndPassword(base64Str)
	{
		return base64ToString(base64Str).split(":");
	}
}
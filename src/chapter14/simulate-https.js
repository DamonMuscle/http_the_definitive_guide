var fs = require("fs");
var NodeRSA = require('node-rsa');
var path = require("path");
var shell = require("shelljs");

module.exports = function(app)
{
	if (!fs.existsSync(path.join(process.cwd(), "src/chapter14/https-bundle.js")))
	{
		shell.exec(`browserify ${path.join(process.cwd(), "src/chapter14/tomake_bundle.js")} -o ${path.join(process.cwd(), "src/chapter14/https-bundle.js")}`);
	}

	app.get("/https-bundle.js", function(req, res)
	{
		res.sendFile(path.join(process.cwd(), "./src/chapter14/https-bundle.js"));
	});

	app.get("/", function(req, res)
	{
		res.sendFile(path.join(process.cwd(), "./src/chapter14/template.html"));
	});

	app.get("/publickey", function(req, res)
	{
		res.send(fs.readFileSync(path.join(process.cwd(), "public.key")));
	});

	app.post("/validate", function(req, res)
	{
		var encrypted = req.body.encrypted;
		var privatekey = fs.readFileSync(path.join(process.cwd(), "private.key"));
		var key = new NodeRSA(privatekey);

		res.json({
			plainText: `your message is: ${key.decrypt(encrypted)}. I'm the server!`,
			sign: key.sign(encrypted, "base64")
		});
	});
}
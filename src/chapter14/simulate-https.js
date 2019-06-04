var fs = require("fs");
var NodeRSA = require('node-rsa');
var path = require("path");
var shell = require("shelljs");
var storage = [];

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

		storage.push(key.decrypt(encrypted));

		var encryptedText = key.encryptPrivate(` I'm the server!, The message you sent can work as the key of symmetrical encryption.`, "base64");
		res.json({
			plainText: encryptedText,
			sign: key.sign(encryptedText, "base64")
		});
	});

	app.post("/realrequest", function(req, res)
	{

	});
}
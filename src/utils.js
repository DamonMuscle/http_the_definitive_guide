var net = require('net');
var fs = require("fs");
var path = require("path");
var NodeRSA = require("node-rsa");

module.exports = {
	checkPort: function(port)
	{
		return new Promise(function(resolve)
		{
			var server = net.createServer().listen(port);

			server.on('listening', function()
			{
				server.close();
				resolve(true);
			})

			server.on('error', function(err)
			{
				resolve(false);
			})
		});
	},
	generateSSLKeys: function()
	{
		return new Promise(function(resolve)
		{
			var key = new NodeRSA();
			key.generateKeyPair();

			fs.writeFileSync(path.join(process.cwd(), "private.key"), key.exportKey("private"));
			fs.writeFileSync(path.join(process.cwd(), "public.key"), key.exportKey("public"));

			resolve();
		});
	}
}
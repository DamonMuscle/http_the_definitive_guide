var net = require('net');

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
				if (err.code === 'EADDRINUSE')
				{
					resolve(false);
				}
			})
		});
	}
}
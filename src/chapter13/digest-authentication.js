/**
 * https://en.wikipedia.org/wiki/Digest_access_authentication
 */
var crypto = require('crypto');

if (!Array.prototype.last)
{
	Array.prototype.last = function()
	{
		return this.length ? this[this.length - 1] : undefined;
	}
}

module.exports = function(app)
{
	var mockUsers = [{
		username: "damon",
		password: "123"
	}],
		nonceArr = [],
		realm = "username is damon and password is 123";

	app.get("/", function(req, res, next)
	{
		var authorization = req.get("Authorization");
		if (!authorization)
		{
			nonceArr.length = 0;
			nonceArr.push(uniqueId());
			res.set("WWW-Authenticate", `Digest realm="${realm}", qop=auth, nonce="${nonceArr.last()}"`);
			res.status(401).send("Authorization Required!");
		}
		else
		{
			var values = authorization.substring("digest".length).split(",").reduce(function(result, current)
			{
				var [key, value] = current.split("=").map(i => i.trim());

				if ((value || "").startsWith("\""))
				{
					value = value.substring(1, value.length - 1);
				}
				result[key] = value;
				return result;
			}, {});

			var matchedUsers = mockUsers.filter(function(u)
			{
				return u.username == values.username;
			});

			if (matchedUsers.length == 0)
			{
				res.status(401).send("invalid user name");
			}

			// username should be unique

			var expectedNonce = nonceArr.last(),
				paramters = Object.assign({}, values, matchedUsers[0], { method: req.method, nonce: expectedNonce });

			if (generateResponse(paramters) == values.response)
			{
				nonceArr.push(uniqueId());
				var rspauth = generateRspauth(Object.assign({}, paramters, { nonce: expectedNonce }));

				res.set("Authentication-Info", `nextnonce="${nonceArr.last()}", qop=${values.qop}, rspauth="${rspauth}", cnonce="${values.cnonce}", nc=${values.nc}`);
				res.send(`
						<!DOCTYPE html>
						<html>
							<head>
								<link rel="icon" href="data:;base64,=">
							</head>
							<body>
								<h1>Welcome ${values.username}!</h1>
								<p>nonce is ${values.nonce}</p>
								<p>expected nonce is ${expectedNonce}</p>
								<p>Current time is ${new Date().toString()}.</p>
								<br />

								${nonceArr.map(nonce => "<p>" + nonce + "</p>").join("")}
							</body>
						</html>
						`);
			}
			else
			{
				res.status(401).send(`
						<!DOCTYPE html>
						<html>
							<head>
								<link rel="icon" href="data:;base64,=">
							</head>
							<body>
								<h1>Invalid!</h1>
								<p style="color:red;">Actual: ${values.nonce}</p>
								<p style="color:darkgreen;">Expected: ${expectedNonce}</p>
								<br />

								${nonceArr.map(nonce => "<p>" + nonce + "</p>").join("")}
							</body>
						</html>
				`);
			}
		}
	});

	function MD5(str)
	{
		return crypto.createHash('md5').update(str).digest('hex');
	}

	function uniqueId()
	{
		return MD5((+new Date) + Math.random().toString("36"));
	}

	function generateResponse({ username, realm, password, method, uri, nonce, cnonce, qop, nc })
	{
		var A1 = `${username}:${realm}:${password}`;
		var A2 = `${method}:${uri}`;

		return MD5(`${MD5(A1)}:${nonce}:${nc}:${cnonce}:${qop}:${MD5(A2)}`);
	}

	function generateRspauth({ username, realm, password, uri, nonce, cnonce, qop, nc })
	{
		var A1 = `${username}:${realm}:${password}`;
		var A2 = `:${uri}`;

		return MD5(`${MD5(A1)}:${nonce}:${nc}:${cnonce}:${qop}:${MD5(A2)}`);
	}
};
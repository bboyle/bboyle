// build a form using node server
var http = require('http');
var querystring = require('querystring');
//var jquery = require('jquery-1.4.4.min.js');

http.createServer(function (req, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<html><head><title>Hello</title></head><body><h1>Hello world</h1>');
	
	var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	});
	
	req.addListener('end', function() {
		if (data) {
			console.log(data);
			console.log(querystring.parse(data));
			//console.log(unescape(data));
			//console.log(unescape(data.replace(/\+/g, ' ')));
			// in format: json=%7Btitle%3A%27Build+a+form%27%2Cq%3A%5B%7Blabel%3A%27Question+1%27%7D%2C%7Blabel%3A%27Question+2%27%7D%5D%7D
			// needs to be: {title:'Build a form', ... }			
			// trim "json=" from POST data
			// replace '+' with space
			// unescape JSON
			// data = data.replace(/^.*?=/, '');
			// data = data.replace(/\+/g, ' ');
			data = querystring.parse(data);
			response.write('<pre>' + data.json + '</pre>');
		} else {
			response.write('<form action="./" method="post"><input type="hidden" name="q.type" value="text"/><input type="hidden" name="q" value="Question 1"/><input type="hidden" name="q" value="Question 2"/><input type="hidden" name="json" value="{title:\'Build a form\',q:[{label:\'Question 1\'}]}" /><input type="submit" value="bar" /></form>');
		}		
		
		response.end('</body></html>');
	});
	
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
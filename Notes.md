1. After installing 'firebase-tools' (for firebase functions), we need to sign in the firebase CLI
    firebase login
    firebase projects:list
2. firebase-admin, has the firestore package to manage the database, and for accessinig the storage bucket too
3. 'firebase' has the firebase authentication library
4. The default authentication mechanism of firebase only allows you to store information like email, password, etc. But we need more info to identify if a user owns that todo, so that they can perform read, update and delete operations on it. To achieve this goal we need to create a new collection, eg. called 'users', in which we will store the user's data which will be mapped to the todo based on the username. NOTE - Each username to be unique

5. Working of the SignUpApi ->
	First, validate the user data, after that we send an email and password to the firebase 'createUserWithEmailAndPassword' module to create the user. Once the user is successfully created, we save the user credentials in the database.

6. To upload the profile picture we will be using the package named 'busboy'

7. Example of busyboy, from npmjs.com/package/busboy  - 
	1. ****Parsing(multipart) with default optionsa : ****
	`var http = require('http'),
	    inspect = require('util').inspect;
	 
	var Busboy = require('busboy');
	 
	http.createServer(function(req, res) {
	  if (req.method === 'POST') {
	    var busboy = new Busboy({ headers: req.headers });
	    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
	      file.on('data', function(data) {
	        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
	      });
	      file.on('end', function() {
	        console.log('File [' + fieldname + '] Finished');
	      });
	    });
	    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
	      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
	    });
	    busboy.on('finish', function() {
	      console.log('Done parsing form!');
	      res.writeHead(303, { Connection: 'close', Location: '/' });
	      res.end();
	    });
	    req.pipe(busboy);
	  } else if (req.method === 'GET') {
	    res.writeHead(200, { Connection: 'close' });
	    res.end('<html><head></head><body>\
	               <form method="POST" enctype="multipart/form-data">\
	                <input type="text" name="textfield"><br />\
	                <input type="file" name="filefield"><br />\
	                <input type="submit">\
	              </form>\
	            </body></html>');
	  }
	}).listen(8000, function() {
	  console.log('Listening for requests');
	});`

8. 
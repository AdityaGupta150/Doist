	/*Error - Cannot use import statement outside a module*/

const { admin, db } = require('../util/admin');
const { config } = require('../util/config');

const firebase = require('firebase');

const { validateLoginData, validateSignUpData } = require('../util/validators');

firebase.initializeApp(config);

	//Login
	//The token received expires in 60 minutes. To generate a new token, use this API again
let loginUser = (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password,
	}

	const { valid, errors } = validateLoginData(user);
	if(!valid) return res.status(400).json(errors);
	else console.log("Login successful yaar! :D");

	firebase
		.auth()
			//'signinWithEmailAndPassword' is a firebase 'module' to check if user credentials are correct
		.signInWithEmailAndPassword(user.email, user.password)
		.then( (data) => {
			return data.user.getIdToken();
		})
		.then( (token) => {	//2 then chained !
			return res.json({ token });
		})
		.catch( (error) => {});
			//When the 'data' passed is NOT correct, then error 403 ('wrong credentials')

};

let signUpUser = (req, res) => {
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		country: req.body.country,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		username: req.body.username,
	};

	const { valid, errors } = validateSignUpData(newUser);

	if( !valid ) return res.status(400).json(errors);

	let token, userId;
	db.doc('/users/${newUser.username}')
		.get()
		.then( (doc) => {
			if( doc.exists ) return response .status(400).json({ username: 'This username has already been taken'});
			else{
				return firebase.auth()
							.createUserWithEmailAndPassword( newUser.email, newUser.password );
			}
		})
		.then( (data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idtoken) => {	//3 then() chained
			token = idtoken;
			const userCredentials = {
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				username: newUser.username,
				phoneNumber: newUser.phoneNumber,
				country: newUser.country,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				userId
			};
			return db.doc('/users/${newUser.username}')
					.set(userCredentials);
		})
		.then( () => {
			return res.status(201).json({ token });
		})
		.catch( (err) => {
			console.error(err);
			if( err.code === 'auth/email-already-in-use' )
				return res.status(400).json({ email: 'Email already in use' });
			else
				return res.status(500).json({ general: 'Something went wrong, you should please try again' });
		});
};

	//We receive the name of the image, which is then passed to bucket.file() to get access to the file, which we then delete
let deleteImage = (imageName) => {
	const bucket = admin.storage().bucket();
	const path = '$(imageName)';
	return bucket.file(path).delete()
	.then( () => {
		return;
	})
	.catch( (error) => {
		console.log(error);
	});
}

	//Uploading profile picture
let uploadProfilePhoto = (req,res) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os')
	const fs = require('fs')


	const busboy = new BusBoy({ headers: req.headers});

	let imageFileName;
	let imageToBeUploaded = {};

	/*Some info on MimeTypes ->
	It's an internet related filetype.
	The mime file extension is related to MIME, the Multipurpose Internet Mail Extension.
	It's a protocol for transmitting non-text information across the internet.
	Basically, non-ASCII data is converted to ASCII for transimission and then converted back at the receiving end
	*/
	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
			//All the useful data we need is being passed by busboy itself, to our callback, for eg. the, file object, filename and mimetype
		if(mimetype !== 'image/png' && mimetype !== 'image/jpeg'){
			return res.status(400).json({error: 'Only JPEG and PNG file types are supported'});
		}
			//ie. get the ending string, after spliting on basis of '.'
		const imageExtension = filename.split('.')[filename.split('.').length -1];
		imageFileName = `${req.user.username}.${imageExtension}`;	//QUESTION - Why here ${} instead of $() ?
			//QUESTION - What difference does using `` or '' does? For eg. at above line, it shows in green when in single quotes?

			//*QUESTION - What does os.tmpdir() return?	 ANSWER - It is an inbuilt API, of the os module, which gives the path to 'default directory for temporary files of the OS'
		const filePath = path.join( os.tmpdir(), imageFileName);
		imageToBeUploaded  = { filePath, mimetype };
			//QUESTION - What is the 'file' object actually for? Ie. what are the other methods, why cant we need only filename
		file.pipe( fs.createWriteStream(filePath) );
			//QUESTION - What does it do?
	});

	deleteImage(imageFileName);	//QUESTION - Why did we need to do so? AND, doesnt deleteImage() delete from out online storage bucket, but we fetched the file from system? Why, to remove Duplicate?

	busboy.on( 'finish', () => {
		admin.storage().bucket()
								//QUESTION - imageToBeUplaoded already contains the filePath, why need to specify again?
							.upload( imageToBeUploaded, filePath, { resumable: false, metadata: { metadata: { contentType: imageToBeUploaded.mimetype }}})
							.then( () => {
								const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
								return db.doc(`/users/${req.user.username}`).update( { imageUrl } );
							})
							.then( () => {
								return res.json({ message: 'Image uploaded successfully'});
							})
							.catch( (error) => {
								console.error(error);
								return res.status(500).json({ error: error.code });
							});
	});

	busboy.end(req.rawBody);
}

exports.loginUser = loginUser;
exports.signUpUser = signUpUser;
exports.uploadProfilePhoto = uploadProfilePhoto;
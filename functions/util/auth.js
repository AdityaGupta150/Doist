const { admin, db } = require('./admin');

	//module.exports and exports are very similar, and actually exports is an alias to the 'exports' attribute in module (Source of Info: Medium)
	//But, generally module.exports is used when the file exports only a single object/function
module.exports = (req, res, next) => {
	let idToken;
		//It seems that the 'request object' will be containing a member 'authorization', with actually contains the Token provided, after the user would have successfully logged in, and the string starts with 'Bearer '
		//According to my above comment, this can just be said to be a preliminary check, plus fetching out the TokenId from the autorizaion string member of request
	if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
		idToken = req.headers.authorization.split('Bearer ')[1];
	else{
		console.error('No token found');
		return res.status(403).json({ error: 'Unauthorized' });
	}

	admin.auth()
			//Here, we used the firebase 'verifyIdToken' module to verify the token; After that, we receive decoded user details, and then we pass them to the existing request
		.verifyIdToken(idToken)
		.then( (decodedToken) => {
			req.user = decodedToken;
				//QUESTION - What is the .limit().get() method?? It probably limited the returned records to 1? But couldn't search much on web
			return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
		})
		.then( (data) => {
			req.user.username = data.docs[0].data().username;
			req.user.imageUrl = data.docs[0].data().imageUrl;
			return next();	//QUESTION - Dont we need to pass the res, and req arguments here?
		})
		.catch( (err) => {
			console.error('Error while verifying token', err);
			return res.status(403).json(err);
		});
};
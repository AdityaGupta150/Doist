//Will import Axios package and Material-UI cmponents here

import axios from 'axios'

import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

//Adding styles to our login page
const styles = (theme) => ({	//QUESTION - Is it a callback?
	paper : {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar : {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form : {
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit : {
		margin: theme.spacing(3,0,2),
	},
	customError : {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10,
	},
	progress : {
		position: 'absolute',
	},
});

//Creating a class named login, which has a form and submit handler inside it
class login extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: [],
			loading: false,
		};
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.UI.errors){
			this.setState({	//takes an object
				errors: nextProps.UI.errors,
			});
		}
	}

	handleChange = (event) => {	//A callback
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = (event) => {	//A callback
		event.preventDefault();
		this.setState({loading : true});
		const userData = {
			email: this.state.email,
			password: this.state.password,
		};

		axios 	//Making an AAX request
			.post('/login', userData)	//returns a promise, which must return something, so we use then and catch
			.then( (response) => {
				localStorage.setItem('AuthToken', 'Bearer ${response.data.token}');
				this.setState({loading: false});
				this.props.history.push('/');	//KNOW_MORE - History API
			})
			.catch( (error) => {this.setState({
					errors: error.response.data,
					loading: false,
			});
		});
	};

	render() {
		const {classes} = this.props;	//Destructuring 'classes' out of Props, which has classes for different components
		const { errors, loading } = this.state;	//Destructured 'errors' and 'loading' from state, to get to know them

		return(
			<Container component = "main" maxWidth = "xs">
				<CssBaseline /?
				<div className={classes.paper}>
					<Avatar className = {classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">	//QUESTION - What does this mean?
						Login
					</Typography>
					<form className={classes.form} noValidate>	//QUESTION- What does noValidate after a form do?
						<TextField	//QUESTION - No commas here?  It is confusing...
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={errors.email}
							error={errors.email ? true:false}	//Bool to know whether 'error' exists or not
							onChange = {this.handleChange}
						/>
						<TextField	//QUESTION - No commas here?  It is confusing...
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="password"
							label="Password"
							name="password"
							autoComplete="current-password"
							autoFocus
							helperText={errors.password}
							error={errors.password ? true:false}	//Bool to know whether 'error' exists or not
							onChange = {this.handleChange}
						/>
						<Button
							type = "submit"
							fullWidth
							variant = "contained"
							color = "primary"
							className = {classes.submit}
							onClick = {this.handleSubmit}
							disabled = {loading || !this.state.email || !this.state.password}
						>

							Sign In
							{loading && <CircularProgress size={30} className={classes.progress} />}
						</Button>
						<Grid container>
							<Grid item>
								<Link href="signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>

							{errors.general && (
								<Typography variant="body2" className={classes.customError} >
									{errors.general}
								</Typography>
							)}
							</form>
						</div>
					</Container>
			);
	}
}

export default withStyles(styles)(login);	//A material-ui components; QUESTION - what does it do?
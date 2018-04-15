import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { setToken } from '../services/tokenService';
import Welcome from './Welcome';
import Footer from './Footer';

class Login extends Component {
	state: {
		email: '',
		password: ''
	}
	// Maybe pass this down from app.js?
	handleChange = e => {
	  this.setState({ [e.target.name]: e.target.value });
	};
	handleSubmit = e => {
		e.preventDefault();
		const { email, password } = this.state;
		axios
			.post('/auth/login', {
				email,
				password
			})
			.then(res => {
				// If user is found, store token 
				const token = res.data.payload;
				setToken(token);
				this.props.getCurrentUser();
			})
	}
	render() {
	    return (
	        <div className="full-height">
	        	<Welcome />
	        	<main className="page--welcome">
		        	<div className="no-login">
		        		<div className="title">
		        			<h2>Login</h2>
		        			<p>Don't have an account? <Link to="/signup">Sign Up Here</Link></p>
		        		</div>
		        		<form className="form--center" onSubmit={this.handleSubmit}>
			    			  <label className="required" htmlFor="email">Email: 
				    			  <input
				    			  	required
				    			  	className="text"
				    			    type="email"
				    			    onChange={this.handleChange}
				    			    name="email"
				    			    id="email"
				    			    placeholder="bill@murray.com"
				    			  />
			    			  </label>
			    			  <label className="required" htmlFor="password">Password:
				    			  <input
				    			  	className="text"
				    			    type="password"
				    			    onChange={this.handleChange}
				    			    name="password"
				    			    id="password"
				    			    placeholder="Enter password"
				    			  />
			    			  </label>
			    			  <input type="submit" value="Login" />
			    		</form>
		    		</div>
	        	</main>
	        	<Footer/>
	        </div>
	    );
	}
    
}

export default Login;
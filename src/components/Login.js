import React, { Component } from 'react';
import axios from 'axios';
import { setToken } from '../services/tokenService';

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
			.post('/login', {
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
	        <div>
	        	<main>
	        		<h2>Login</h2>
	        		<form onSubmit={this.handleSubmit}>
		    			  <label htmlFor="email">Email: 
			    			  <input
			    			    type="email"
			    			    onChange={this.handleChange}
			    			    name="email"
			    			    id="email"
			    			    placeholder="bill@murray.com"
			    			  />
		    			  </label>
		    			  <label htmlFor="password">Password:
			    			  <input
			    			    type="password"
			    			    onChange={this.handleChange}
			    			    name="password"
			    			    id="password"
			    			    placeholder="Enter password"
			    			  />
		    			  </label>
		    			  <input type="submit" value="Login" />
		    		</form>
	        	</main>
	        </div>
	    );
	}
    
}

export default Login;
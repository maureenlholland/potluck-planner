import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Welcome from './Welcome';
import Footer from './Footer';

class Signup extends Component {
	state: {
		'firstName': '',
		'lastName': '',
		'email': '',
		'password': ''
	}
	// Maybe pass this down from app.js?
	handleChange = e => {
	  this.setState({ [e.target.name]: e.target.value });
	};
	handleSubmit = e => {
		// if you are getting a refresh on each submit with no expected behaviour, check you've included the preventDefault()
		e.preventDefault();
		const { firstName, lastName, email, password } = this.state;
		axios
			.post('/auth/signup', {
				firstName,
				lastName,
				email, 
				password	
			})
			.then(res => {
				if(res.status === 201) {
					const user = res.data.payload;
					this.props.setUser(user);
				}
			})
	}
	render(){
		return (
		    <div className="full-height">
		    	<Welcome />
		    	<main className="page--welcome">
			    	<div className="no-login">
			    		<div className="title">
			    			<h2>Sign Up</h2>
			    			<p>Already have an account? <Link to="/login">Log In Here</Link></p>
			    		</div>
			    		<form className="form--center" onSubmit={this.handleSubmit}>
			    			  <label className="required" htmlFor="firstName">First Name: 
				    			  <input
				    			    required
				    			    className="text"
				    			    type="firstName"
				    			    onChange={this.handleChange}
				    			    name="firstName"
				    			    id="firstName"
				    			    placeholder="Bill"
				    			  />
			    			  </label>
			    			  <label className="required" htmlFor="lastName">Last Name: 
				    			  <input
				    			    required
				    			    className="text"
				    			    type="lastName"
				    			    onChange={this.handleChange}
				    			    name="lastName"
				    			    id="lastName"
				    			    placeholder="Murray"
				    			  />
			    			  </label>
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
				    			    required
				    			    className="text"
				    			    type="password"
				    			    onChange={this.handleChange}
				    			    name="password"
				    			    id="password"
				    			    placeholder="Enter password"
				    			  />
			    			  </label>
			    			  <input type="submit" value="Sign up" />
			    		</form>
			    	</div>
		    	</main>
		    	<Footer/>
		    </div>
		);
	}
}

export default Signup;
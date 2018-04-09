import React, { Component } from 'react';
import axios from 'axios';

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
		    <div>
		    	<main>
		    		<h2>Sign up</h2>
		    		<form onSubmit={this.handleSubmit}>
		    			  <label htmlFor="firstName">First Name: 
			    			  <input
			    			    type="firstName"
			    			    onChange={this.handleChange}
			    			    name="firstName"
			    			    id="firstName"
			    			    placeholder="Bill"
			    			  />
		    			  </label>
		    			  <label htmlFor="lastName">Last Name: 
			    			  <input
			    			    type="lastName"
			    			    onChange={this.handleChange}
			    			    name="lastName"
			    			    id="lastName"
			    			    placeholder="Murray"
			    			  />
		    			  </label>
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
		    			  <input type="submit" value="Signup" />
		    		</form>
		    	</main>
		    </div>
		);
	}
}

export default Signup;
// External Dependencies
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';
import { observable } from "mobx";
import { decorate, observer } from "mobx-react";

// Internal Dependencies
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateEvent from './components/CreateEvent';
import SingleEvent from './components/SingleEvent';
import { getToken } from './services/tokenService';

// const appState = observable({
// 	user: null
// })

// Add binding
class App extends Component {
	@observable user = null;

	setUser = user => {
		this.setState({ user });
	}

	getCurrentUser = () => {
		// console.log()
		// const token = getToken();
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWJiZTU4ZTdjOTg2MGU5MzM4M2M5M2EyIn0sImlhdCI6MTUzOTI3MDU4N30.bZCqNnVexJW1ssQBY9TWe4M-qotXOwFMJPGyW7uRs_0"
		// console.log(token);
		if (token) {
			axios
				.get('/user/current', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				.then(res => {
					const user = res.data.payload;
					console.log('User ' + user);
					this.setState({ user });
				})
		}
	}

	refresh = () => {
		this.getCurrentUser();
	}

	componentDidMount() {
		this.refresh();
	}

	render(){
		return (
			<Router>
				<div>
					<Switch>
						<Route 
							exact path='/login'
							render={() => 
								this.state.user ? 
								<Redirect to='/'/>
								:
								<Login getCurrentUser={this.getCurrentUser}/>
							}
						/>
						<Route
							exact path = '/signup'
							render={() =>
								this.state.user ? 
								<Redirect to='/'/>
								:
								<Signup setUser={this.setUser}/>
							}
						/>
						<Route 
							exact path='/'
							render={ (props) => 
								this.state.user ?
								<Home {...props} 
									refresh={this.refresh}
									setUser={this.setUser}
									user={this.state.user}/>
								:
								<Redirect to='/login'/>
							}
						/>
						<Route 
							path='/create-event'
							render={ (props) => 
								this.state.user ?
								<CreateEvent
									setUser={this.setUser}
									user={this.state.user}
								/>
								:
								<Redirect to='/login'/>
							}
						/>
						<Route 
							path='/event/:id'
							render={ (props) => 
								this.state.user ?
								<SingleEvent 
									{...props} 
									setUser={this.setUser}
									user={this.state.user}
								/>
								:
								<Redirect to='/login'/>
							}
						/>
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App;

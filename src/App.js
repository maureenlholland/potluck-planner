// External Dependencies
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';

// Internal Dependencies
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateEvent from './components/CreateEvent';
import SingleEvent from './components/SingleEvent';
import { getToken } from './services/tokenService';

class App extends Component {
	state = {
		events: [], 
		user: null
	}

	setUser = user => {
		this.setState({ user });
	}

	getCurrentUser = () => {
		const token = getToken();
		if (token) {
			axios
				.get('/user/current', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				.then(res => {
					const user = res.data.payload;
					this.setState({ 
						user 
					}, () => {
						this.refresh();
					});
				})
		}
	}

	refresh = () => {
		const token = getToken();

		const userId = this.state.user && this.state.user._id;
		// 1. Get all events from database
		axios
			.get(`/event/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			.then(res => {
				if ( res.data.payload ) {
					this.setState({events: res.data.payload});
				}
			})
			.catch( err => {
				console.log(err.message);
			})
	}

	componentDidMount() {
		this.getCurrentUser();
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
									events={this.state.events} 
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
									refresh={this.refresh}
									user={this.state.user}
								/>
								:
								<Redirect to='/login'/>
							}
						/>
						<Route 
							path='/event/:eventId'
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

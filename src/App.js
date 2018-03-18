// External Dependencies
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

// Internal Dependencies
import Home from './components/Home';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';
import SingleEvent from './components/SingleEvent';

// loggedIn: bool, /* will be a React thing (stateful)*/
/* 
React:
- Login
- Logout
- Sign-up
- HandleChange
- Refresh
*/

/* 
Database:
- Add User
- Find User
- Create Event
- Get list of events
- Get list of users
- Find Event 
- List event admins
- List event guests
- List categories
- List suggestions/contributions under appropriate categories
- Add user from suggested contribution
- Remove user from suggested contribution (return to suggested contribution)
- Add user contribution
- Edit user contribution
- Remove user contribution (delete entirely)
*/

class App extends Component {
	state = {
		events: []
	}

	refresh = () => {
		// 1. Get all events from database
		axios
			.get('/events')
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
		this.refresh();
	}

	render(){
		return (
			<Router>
				<div>
					<Route 
						exact path='/'
						render={ (props) => <Home {...props} events={this.state.events} refresh={this.refresh}/>}
					/>
					<Route 
						path='/login'
						component={Login}
					/>
					<Route 
						path='/create-event'
						render={ (props) => <CreateEvent {...props} />}
					/>
					<Route 
						path='/event/:event'
						render={ (props) => <SingleEvent {...props} events={this.state.events}/>}
					/>
				</div>
			</Router>
		)
	}
}

export default App;

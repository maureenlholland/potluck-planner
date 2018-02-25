import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {

	// This will error because React thinks it's on a different port (3000)
	// CORS error: Cross Origin Resource opens up potential vulnerabilities
	componentDidMount() {
		axios
		.get('/hello')
		.then((res) => {
			console.log(res.data);
		});
	}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

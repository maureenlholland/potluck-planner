import React from 'react';
import { Link } from 'react-router-dom';

import Logout from './Logout';

// Is there a way to pass setUser here instead of the 

const Header = ({ path, setUser }) => {
    return (
		<header className="header">
	        <div className="wrapper">
	            { path !== "/" &&
	                <Link className="btn" to="/">Home</Link>
	            }
	    		<h1><span className="cursive">Potluck</span>Planner</h1>
	    		<Logout setUser={setUser} />
	        </div>
		</header>
    );
}

export default Header;
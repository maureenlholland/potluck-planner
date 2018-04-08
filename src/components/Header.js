import React from 'react';
import { Link } from 'react-router-dom';

import Logout from './Logout';

// Is there a way to pass setUser here instead of the 

const Header = ({ path, setUser }) => {
    return (
        <div>
        	<header>
        		<h1>Potluck Planner</h1>
        		{/* What's the best way to do this? */}
        		{ path !== "/" &&
        			<Link to="/">Home</Link>
        		}
        		<Logout setUser={setUser} />
        	</header>
        </div>
    );
}

export default Header;
import React from 'react';


const Header = () => {
    return (
        <div>
        	<header>
        		<h1>Potluck Planner</h1>
        		{/* If not Home, add Home Link? */}
                <button>Logout</button>
        	</header>
        </div>
    );
}

export default Header;
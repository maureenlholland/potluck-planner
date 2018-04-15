import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import ListEvents from './ListEvents';

const Home = (props) => {
	const events = props.user.events;
    return (
        <div className="full-height">
        	<Header setUser={props.setUser} path={props.location.pathname} />
        	<main>
    			<div className="center logged-in">
	        		<h2><span className="thin">Your</span> <span className="bold">Events</span></h2>
	        		<Link to='/create-event' className="btn btn--accent">Create Event</Link>
        		</div>
	        	<div className="wrapper">
	                { events.length > 0 ? (
	            		<ListEvents 
	            			events={events}
	            		/>
	            	) : (
	            		<div className="center">No Events Yet! Why not create your own?</div>
	            	) }
            	</div>
        	</main>
        	<Footer />
        </div>
    );
}

export default Home;
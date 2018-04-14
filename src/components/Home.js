import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import ListEvents from './ListEvents';

const Home = (props) => {
	const events = props.user.events;
    return (
        <div>
        	<Header setUser={props.setUser} path={props.location.pathname} />
        	<main>
        		<h2>Home</h2>
        		<Link to='/create-event'>Create Event</Link>
                { events.length > 0 ? (
            		<ListEvents events={events} />
            	) : (
            		<div>No Events</div>
            	) }
        	</main>
        </div>
    );
}

export default Home;
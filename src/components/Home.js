import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import ListEvents from './ListEvents';

const Home = (props) => {
    return (
        <div>
        	<Header setUser={props.setUser} path={props.location.pathname} />
        	<main>
        		<h2>Home</h2>
        		<Link to='/create-event'>Create Event</Link>
                { props.events.length === 0 ? 'No events' : '' }
        		<ListEvents events={props.events} refresh={props.refresh}/>
        	</main>
        </div>
    );
}

export default Home;
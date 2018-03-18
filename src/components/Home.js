import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import ListEvents from './ListEvents';

const Home = (props) => {
    return (
        <div>
        	<Header />
        	<main>
        		<h2>Home</h2>
        		<Link to='/create-event'>Create Event</Link>
        		{ /* if events exist, show event list, else "No Events - why not create one?"*/}
        		<ListEvents events={props.events} refresh={props.refresh}/>
        	</main>
        </div>
    );
}

export default Home;
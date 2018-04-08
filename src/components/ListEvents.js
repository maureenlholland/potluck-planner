import React from 'react';
import { Link } from 'react-router-dom';

const ListEvents = ({ events }) => {
    return (
        <div>
	        <h3>Events</h3>
	        <ul>
	        {events.map(event => {
	        	return (
	        			<li key={ event._id }>
		        			<Link to={`/event/${event._id}`}>
		        				<h4>{event.title}</h4>
		        				<p>{event.date}</p>
		        				<p>{event.address}</p>
		        				<p>{event.description}</p>
		        				<img src={event.image} alt={event.title} />
	        				</Link>
	        			</li>
	        		)
	        })}
	        </ul>
        </div>
    );
}

export default ListEvents;
import React from 'react';

const ListEvents = ({ events }) => {
    return (
        <div>
	        <h3>Events</h3>
	        <ul>
	        {events.map(event => {
	        	return (
	        			<li key={ event._id }>
	        				<h4>{event.title}</h4>
	        				<p>{event.date}</p>
	        				<p>{event.address}</p>
	        				<p>{event.description}</p>
	        				<img src={event.image} alt={event.title} />
	        			</li>
	        		)
	        })}
	        </ul>
        </div>
    );
}

export default ListEvents;
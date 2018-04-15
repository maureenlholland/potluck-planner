import React from 'react';
import { Link } from 'react-router-dom';

const ListEvents = ({ events }) => {
    return (
        <div>
	        <ul className="event-list">
	        {events.map(event => {
	        	return (
	        			<li key={ event._id }>
		        			<Link className="event-list__list-item"to={`/event/${event._id}`}>
		        				<div className="list-item__date">
		        					<span className="date--top bold">15</span>
		        					<span className="date--bottom">Apr 2018</span>
		        				</div>
		        				<div className="list-item__text">
			        				<h4>{event.title}</h4>
			        				<p className="keyline">{event.date} &#8212; {event.address}</p>
			        				<p>{event.description}</p>
		        				</div>
		        				<div className="list-item__image">
		        					<img width="300" height="200" src={event.image} alt={event.title} />
		        				</div>
	        				</Link>
	        			</li>
	        		)
	        })}
	        </ul>
        </div>
    );
}

export default ListEvents;
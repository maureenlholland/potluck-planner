import React from 'react';
import { Link } from 'react-router-dom';

const ListEvents = ({ events }) => {
    return (
        <div>
	        <ul className="event-list">
	        {events.map(event => {
	        	let d = new Date(event.date);
	        	console.log(d);
	        	const options = {
	        		hour12: true,
	        		weekday: 'short',
	        		month: 'short',
	        		day: 'numeric',
	        		year: 'numeric',
	        		hour: 'numeric',
	        		minute: 'numeric'
	        	}
	        	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]; 
	        	return (
	        			<li key={ event._id }>
		        			<Link className="event-list__list-item"to={`/event/${event._id}`}>
		        				<div className="list-item__date">
		        					<span className="date--top bold">{ d.getDate()}</span>
		        					<span className="date--bottom">{ months[d.getMonth()]} {d.getFullYear()}</span>
		        				</div>
		        				<div className="list-item__text">
			        				<h4>{event.title}</h4>
			        				<p className="keyline">{d.toLocaleDateString('en-US', options)}  &#8212; {event.address}</p>
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
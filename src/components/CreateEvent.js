import React, { Component } from 'react';
import axios from 'axios';

import Header from './Header';
import '../App.css';

/*
Create simplest version of an event, save to database
Use state in this component only for now
*/

class CreateEvent extends Component {
	state = {
		title: '',
		date: '',
		time: '',
		address: '',
		image: '',
		description: '',
		categories: [],
		category: ''
	}
	// For all inputs and textareas
	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	// Clear input
	clearInput = (e) => {
	  this.setState({ 
	  		[e.target.name]: '' 
	  });
	}
	// Remove item
	removeItem = (index) => {
	  const removeTodo = Array.from(this.state.categories);
	  removeTodo.splice(index,1);
	  this.setState({ categories: removeTodo })
	}
	// Add a category
	addCategory = (e) => {
		console.log(e);
		const newCategories = Array.from(this.state.categories);
		newCategories.push(this.state.category);
		this.setState({ categories: newCategories });
		this.clearInput(e);
	}
	// Add a suggestion
	// addSuggestions()
	// Add a guest
	// Submit Event
	handleSubmit = (e) => {
		e.preventDefault();
		const title = this.state.title;
		const dateString = this.state.date;
		const timeString = this.state.time;
		const address = this.state.address;
		const image = this.state.image;
		const description = this.state.description;
		axios
			.post('/events', {
				title: title,
				date: new Date(dateString + ' ' + timeString),
				address: address,
				image: image,
				description: description
			})
			// .then(this.props.refresh) - Send to single event page!
	}
	render() {
	    return (
	        <div>
	        	<Header />
	        	<main>
	        		<h2>Create Event</h2>
	        		<form onSubmit={this.handleSubmit}>
	        			<label htmlFor="pl-title">
	        			Title
	        				<input 
	        					onChange={this.handleChange}
	        					id="pl-title"
	        					name="title" 
	        					type="text"
	        					required></input>
	        			</label>
	        			<label htmlFor="pl-date">
	        			Date
	        				<input 
	        					onChange={this.handleChange}
	        					id="pl-date"
	        					name="date"
	        					type="date"></input>
	        			</label>
	        			<label htmlFor="pl-time">
	        			Time
	        				<input 
	        					onChange={this.handleChange}
	        					id="pl-time"
	        					name="time"
	        					type="time"></input>
	        			</label>
	        			<label htmlFor="pl-address">
	        			Address
	        				<input 
	        					onChange={this.handleChange}
	        					id="pl-address"
	        					name="address"
	        					type="text"></input>
	        			</label>
	        			<label htmlFor="pl-image">
	        			Image URL
	        				<input 
	        					onChange={this.handleChange}
	        					id="pl-image"
	        					name="image"
	        					type="url"></input>
	        			</label>
	        			<label htmlFor="pl-description">
	        			Description
	        				<textarea 
	        					onChange={this.handleChange}
	        					id="pl-description"
	        					name="description"></textarea>
	        			</label>
	        			<fieldset>
	        				<legend>Categories</legend>
	        				<div>
		        				<label htmlFor="pl-category">
		        					<input 
		        						onChange={this.handleChange}
		        						id="pl-category" 
		        						name="category" 
		        						placeholder="Category One"
		        						value={this.state.category}></input>
		        						<button 
		        							type="button" 
		        							onClick={this.addCategory}>
		        							Add Category</button>
		        				</label>
		        				<ul>
		        					{this.state.categories.map( (category, index) => { 
		        						return (
		        								<li key={`category-${index}`}>
		        								{category}
		        									<button
		        										type="button">
		        										Add Suggestion</button>
		        									<button
		        										type="button"
		        										onClick={ () => this.removeItem(index) }>
		        										Remove</button>
		        								</li>
		        							)
		        					})}
		        				{/* add input if suggestion pressed */}
		        				</ul>
	        				</div>
	        			</fieldset>
	        			<fieldset>
	        				<legend>Guest List</legend>
	        				<div>
	        					<label htmlFor="pl-attendees">Email
	        						<input
	        							id="pl-attendees"
	        							name="attendees"
	        							type="email"></input>
	        					</label>	
	        					<button 
	        						type="button">
	        						Add to list</button>
	        				</div>
	        				<ul>
	        					{/* map over categories */}
	        					<li>
	        					Guest Name 
	        						<button
	        							type="button">
	        							Remove</button>
	        					</li>
	        				</ul>	
	        			</fieldset>
	 					<input 
	 						id="pl-publish"
	 						type="submit"
	 						value="Publish Event"></input>
	        		</form>
	        	</main>
	        </div>
	    )
	}
    
}

export default CreateEvent;
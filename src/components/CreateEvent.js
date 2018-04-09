import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import Header from './Header';
import '../App.css';

/*
Create simplest version of an event, save to database
Use state in this component only for now
*/

class CreateEvent extends Component {
	state = {
		eventSubmitted: '',
		title: '',
		date: '',
		time: '',
		address: '',
		image: '',
		description: '',
		categories: [],
		category: '',
		suggestion: ''
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
	// Remove category
	removeCategory = (index) => {
	  const removeCategory = Array.from(this.state.categories);
	  removeCategory.splice(index,1);
	  this.setState({ categories: removeCategory })
	}
	// Clear category input
	clearCategory = () => {
		this.setState({category: ''});
	}
	// Add a category
	// note that clearInput won't work here because the event is on the button and not the input
	addCategory = (e) => {
		const newCategories = Array.from(this.state.categories);
		newCategories.push({
			name: this.state.category,
			suggestions: []
		});
		this.setState({ categories: newCategories });
		this.clearCategory();
	}
	// Remove category
	removeSuggestion = (suggestion, index) => {
		// Copy  categories array
		const newCategories = Array.from(this.state.categories);
		// Find category with suggestion to remove
		const targetCategory = newCategories[suggestion.category];
		// Copy suggestions array within that category
		const newSuggestions = targetCategory.suggestions;
		// Remove suggestion
		newSuggestions.splice(index, 1);
		// Re-render with removed suggestion
		this.setState({ categories: newCategories });
	}
	// Clear suggestion input
	clearSuggestion = () => {
		this.setState({suggestion: ''});
	}
	// Add a suggestion
	addSuggestion = (e, index) => {
		// Add within categories array
		const newCategories = Array.from(this.state.categories);
		const newCategory = newCategories[index];
		const newSuggestions = newCategory.suggestions;
		const suggestion = {
			name: this.state.suggestion,
			category: index
		};
		newSuggestions.push(suggestion);
		newCategories.splice(index, 1, newCategory);
		this.setState({ categories: newCategories });
		this.clearSuggestion();
	}
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
		const categories = this.state.categories;
		const admin = this.props.user._id;
		const creator = this.props.user._id;

		axios
			.post('/event/create', {
				title: title,
				date: new Date(dateString + ' ' + timeString),
				address: address,
				image: image,
				description: description,
				categories: categories,
				admin: admin,
				creator: creator
			})
			.then((res)=>{
				const eventId = res.data.payload._id;
				this.setState({
					eventSubmitted: eventId
				}, this.props.refresh);
			})
	}
	render() {
		// https://tylermcginnis.com/react-router-programmatically-navigate/
		if (this.state.eventSubmitted) {
		      return <Redirect to={`/event/${this.state.eventSubmitted}`} />
		    }
	    return (
	        <div>
	        	<Header setUser={this.props.setUser} />
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
		        						value={this.state.category}></input>
		        						<button 
		        							type="button" 
		        							onClick={this.addCategory}>
		        							Add Category</button>
		        				</label>
		        				<ul>
		        					{this.state.categories.map( (category, index) => { 
		        						console.log(category);
		        						return (
		        								<li key={`category-${index}`}>
		        								{category.name}
		        									<button
		        										type="button"
		        										onClick={ () => this.removeCategory(index) }>
		        										Remove</button>
		        									<input
		        										onChange={this.handleChange}
		        										id="pl-suggestion"
		        										name="suggestion"
		        										placeholder="Add suggestion"
		        										value={this.state.suggestion}
		        									></input>
		        									<button
		        										type="button"
		        										onClick={(e) => this.addSuggestion(e, index)}>
		        										Add Suggestion</button>
		        								{/* separate out these maps into functions and use functions as first-class citizens  */}
													<ul>
			        									{category.suggestions.map( (suggestion, index) => {
			        										console.log(suggestion);
			        										return (
			        												<li key={`suggestion-${index}`}>
			        													{suggestion.name}
			        													<button
			        														type="button"
			        														onClick={ () => this.removeSuggestion(suggestion, index) }>
			        														Remove</button>
			        												</li>
			        											)
			        									} )}
			        								</ul>
		        								</li>
		        								
		        							)
		        					})}
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
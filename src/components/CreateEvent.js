import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import Header from './Header';
import '../App.css';

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
		suggestion: '',
		guests: [],
		guest: '',
		guestError: false
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
	// Remove suggestion
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
	// Clear guest input
	clearGuest = () => {
		this.setState({guest: ''});
	}
	// Add a guest
	addGuest = (e) => {
		const email = this.state.guest;
		// probably a better way to do this
		// Error handle for no user match
		axios 
			.get(`/user/${email}`)
			.then( res => {
				const user = res.data.payload;
				if ( user ) {
					const newGuests = Array.from(this.state.guests);
					newGuests.push(user);
					this.setState({ guests: newGuests });
					this.setState({ guestError: false });
					this.clearGuest();
				} else {
					this.setState({ guestError: true });
				}
			})
			.catch( err => {
				console.log(err);
			});
	}
	// Remove a guest
	removeGuest = (index) => {
	  const removeGuest = Array.from(this.state.guests);
	  removeGuest.splice(index,1);
	  this.setState({ guests: removeGuest });
	}
	// Submit Event
	handleSubmit = (e) => {
		e.preventDefault();
		// Validation, if empty, don't include?
		const title = this.state.title;
		const dateString = this.state.date;
		const timeString = this.state.time;
		const address = this.state.address;
		const image = this.state.image;
		const description = this.state.description;
		const categories = this.state.categories;
		const admin = [this.props.user];
		const guests = this.state.guests;
		axios
			.post('/event/create', {
				title: title,
				date: new Date(dateString + ' ' + timeString),
				address: address,
				image: image,
				description: description,
				categories: categories,
				admins: admin,
				guests: guests
			})
			.then((res)=>{
				const eventId = res.data.payload._id;
				this.setState({eventSubmitted: eventId});
				// I need some way to get the user stored in app.js state to update
			})
			.catch(err => {
				console.log(err);
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
	        					<label htmlFor="pl-guest">Email
	        						<input
	        							onChange={this.handleChange}
	        							id="pl-guest"
	        							name="guest"
	        							type="email"
	        							placeholder="guest@email.com"
	        							value={this.state.guest ? this.state.guest : ''}></input>
	        					</label>
	        					{ this.state.guestError && 
	        						<p>Sorry, we do not have a user registered with that email. Please try again.</p>
	        					}	
	        					<button 
	        						type="button"
	        						onClick={this.addGuest}>
	        						Add to list</button>
	        				</div>
	        				<ul>
	        					{this.state.guests.map( (guest, index) => { 
        							return (
        									<li key={`guest-${index}`}>
        									{guest.email} 
        										<button
        											type="button"
        											onClick={ () => this.removeGuest(index) }>
        											Remove</button>
        									</li>
        								)
	        					} ) }
	     
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
import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import DateTime from 'react-datetime';

import Header from './Header';
import Footer from './Footer';
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
	setDate = (e) => {
		console.log(e._d);
		this.setState({
			date: e._d
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
		// store datetime in UTC
		const date = new Date(this.state.date);
		const address = this.state.address;
		const image = this.state.image;
		const description = this.state.description;
		const categories = this.state.categories;
		const admin = [this.props.user];
		const guests = this.state.guests;

		console.log(date);
		// return;

		axios
			.post('/event/create', {
				title: title,
				date: date,
				// time: time,
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
	        <div className="full-height">
	        	<Header setUser={this.props.setUser} />
	        	<main>
	        		<div className="center logged-in">
	        			<h2><span className="thin">Create</span> <span className="bold">Event</span></h2>
	        		</div>
		        	<div className="wrapper wrapper--inner">
		        		<form className="create-event" onSubmit={this.handleSubmit}>
		        		<div className="fb-container">
		        			<label className="required" htmlFor="pl-title">
		        			Title
		        				<input 
		        					required
		        				
		        					onChange={this.handleChange}
		        					id="pl-title"
		        					name="title" 
		        					type="text"></input>
		        			</label>
		        			<label className="required" htmlFor="pl-address">
		        			Address
		        				<input 
		        					required
		        				
		        					onChange={this.handleChange}
		        					id="pl-address"
		        					name="address"
		        					type="text"></input>
		        			</label>
		        		</div>
		        		<div className="fb-container">

		        			<label className="required" htmlFor="pl-date">
		        			Date and Time
		        				<DateTime onChange={this.setDate} inputProps={{ id:'pl-date', name:'date' }}/>
		        				{/*<input 
		        					required
		        				
		        					onChange={this.handleChange}
		        					id="pl-date"
		        					name="date"
		        					type="date"></input>*/}
		        			</label>
		        			<label className="required" htmlFor="pl-time">
		        			Time
		        				<input 
		        					required
		        				
		        					onChange={this.handleChange}
		        					id="pl-time"
		        					name="time"
		        					type="time"></input>
		        			</label>
		        		</div>
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
		        				<legend className="required">Categories</legend>
		        				<div>
			        				<label htmlFor="pl-category">
			        					<input 
			        						onChange={this.handleChange}
			        						id="pl-category" 
			        						name="category" 
			        						placeholder="Anything you want!"
			        						value={this.state.category}></input>
			        				</label>
			        				<button 
			        					type="button" 
			        					onClick={this.addCategory}>
			        					Add Category</button>
			        				<ul className="form-categories">
			        					{this.state.categories.map( (category, index) => { 
			        						return (
			        								<li key={`category-${index}`}>
				        								<span className="form-categories--single">
				        								{category.name}
				        									<button
				        										type="button"
				        										onClick={ () => this.removeCategory(index) }>
				        										Remove</button>
				        								</span>
				        								<label htmlFor="pl-suggestion">
				        									<input
				        										onChange={this.handleChange}
				        										id="pl-suggestion"
				        										name="suggestion"
				        										placeholder="Add suggestion"
				        										value={this.state.suggestion}
				        									></input>
			        									</label>
			        									<button
			        										type="button"
			        										onClick={(e) => this.addSuggestion(e, index)}>
			        										Add Suggestion</button>
			        								{/* separate out these maps into functions and use functions as first-class citizens  */}
														<ul className="form-list--light">
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
		        						Add Guest</button>
		        				</div>
		        				<ul className="form-list--light">
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
		        	</div>
	        	</main>
	        	<Footer/>
	        </div>
	    )
	}
    
}

export default CreateEvent;
import React, { Component } from 'react';
import axios from 'axios';
import { observable } from "mobx";
import { observer } from "mobx-react";

import Header from './Header';
import Footer from './Footer';

class SingleEvent extends Component {
    state = {
       event: {},
       category: null,
       contribution: ''
     }
     refresh = () => {
        // 1. Get single event from database
        axios
            .get(`${this.props.match.params.id}`)
            .then(res => {
                if ( res.data.payload ) {
                    this.setState({event: res.data.payload});
                }
            })
            .catch( err => {
                console.log(err.message);
            })
     }
     componentDidMount () {
       this.refresh();
     }
     // For all inputs and textareas
     handleChange = (e) => {
     	this.setState({
     		[e.target.name]: e.target.value
     	})
     }
     removeClaim = (obj) => {
        // when you claim a suggestion, you use the suggestion object, but when you remove a suggested claim, you use the contribution object
        // Remove claim
        axios 
            .put('/event/suggestion/remove', {
                event: this.state.event,
                contribution: obj,
                claimed: false 
            })
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.log(err);
            })
     }
     // Claim Suggestion
     claimSuggestion = (suggestionObj) => {
        console.log('claim object: ' + suggestionObj);
        const suggestionName = suggestionObj.name;
        const suggestionIndex = suggestionObj.category;
        const category = this.state.event.categories[suggestionObj.category];
        const event = this.state.event;
        const newContribution = {
            category: category,
            contribution: suggestionName,
            suggestion: suggestionIndex
        };
        // Claim suggestion
        axios 
            .put('/event/suggestion/claim', {
                event: event,
                suggestion: suggestionObj,
                claimed: true 
            })
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.log(err);
            })
        // console.log(this.state.contribution);
        this.addContribution(newContribution);
     }
     // Remove Contribution
     removeContribution = (contributionObj) => {
        
        if (contributionObj.suggestionId !== '') {
            this.removeClaim(contributionObj);
        }
        const contribution = contributionObj._id; 
        const category = contributionObj.category; 
        const event = this.state.event._id;
        console.log(contribution);
        console.log(category);
        console.log(event);
        // delete contribution
        // 404 error means no match between axios route and express route (in lib/routes)
        axios
     		.delete(`/contribution/${contribution}/${category}/${event}`)
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.log(err);
            })
        // update event 
        this.refresh();
     } 
     // Add input for Contribution addition to the proper category
     addInput= (e, category) => {
     	this.setState({ category: category });
     }
     // Clear Contribution & Category
     clearContribution = () => {
     	this.setState({ category: ''});
     	this.setState({ contribution: '' });
     }
     // Add a contribution
    handleSubmit = (e) => {
     	e.preventDefault();
        const newContribution = {
            category: this.state.category,
            contribution: this.state.contribution
        };
        this.addContribution(newContribution);
     }

     addContribution = (obj) => {
        const category = obj.category;
        const contribution = obj.contribution;
        // Axios request to create Contribution (POST)
         axios
             .post('/contribution/create', {
                 name: contribution,
                 user: this.props.user,
                 eventId: this.state.event._id,
                 category: category
            })
            .then(doc => {
             console.log(doc);
                
            })
            .catch(err => {
                console.log(err);
            })

        // Clear input field
        this.clearContribution();
        // update event
        this.refresh();
     }
     
    render(){
        const event = this.state.event;
        let d = new Date(event.date);
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
            <div className="full-height">
                <Header setUser={this.props.setUser} />
                <main>
	                <div className="center logged-in">
	                    <h2>{event.title}</h2>
	                </div>
	                 <div className="wrapper">
		                 <div className="event-list__list-item">
	        				<div className="list-item__date">
	        					<span className="date--top bold">{ d.getDate()}</span>
	        					<span className="date--bottom">{months[d.getMonth()]} {d.getFullYear()}</span>
	        				</div>
	        				<div className="list-item__text">
		        				<h2>{event.title}</h2>
		        				<p className="keyline">{d.toLocaleDateString('en-US', options)}  &#8212; {event.address}</p>
		        				<p>{event.description}</p>
	        				</div>
		                    <div className="list-item__image">
	        					<img width="300" height="200" src={event.image} alt={event.title} />
	        				</div>
	        			</div>
	        			<div className="fb-container single-event">
		                    <div className="event__menu">
		                    {/*https://reactjs.org/docs/conditional-rendering.html*/}
		                    { event.categories &&
		                            <ul>
		                                {event.categories.map( (category, index) => { 
		                                    return (
		                                            <li key={category._id} id={category._id}>
		                                            <h3>{category.name}
			                                            <button
			                                            	type="button"
			                                            	onClick={(e) => this.addInput(e, category)}
			                                            >Add Item</button>
		                                            </h3>
		                                            { this.state.category &&
		                                                <form className="addInput" onSubmit={this.handleSubmit}>
		                                                    <label htmlFor="pl-contribution">
		                                                        <input 
		                                                        	type="text"
		                                                            onChange={this.handleChange}
		                                                            id="pl-contribution" 
		                                                            name="contribution" 
		                                                            value={this.state.contribution} />
		                                                    </label>
		                                                    <input 
		                                                        type="submit"
		                                                        value="Submit"
		                                                    />
		                                                </form>     
		                                             }
		                                             <div className="suggestions">
		                                             { category.suggestions.length > 0 &&
		                                                <h4>What we need:</h4>
		                                             }
		                                                <ul>
		                                                    {category.suggestions.map( (suggestion, index) => {
		                                                    	if( suggestion.claimed ){
		                                                    		return null;
		                                                    	} else {
		                                                    		return (
		                                                					<li key={`suggestion-${index}`}>
		                                                					    {suggestion.name}
		                                                					    <button onClick={() => this.claimSuggestion( suggestion)}>Got it!</button>
		                                                					</li> 
		                                                    		    )
		                                                    	}
		                                                    } )}
		                                                </ul>
		                                                </div>
		                                                <div className="contributions">
			                                                { category.contributions.length > 0 &&
			                                                   <h4 >What we have:</h4>
			                                                }
			                                                <ul>
			                                                	{category.contributions.map( (contribution, index) => {
			                                                		return (
			                                                				<li key={`contribution-${index}`}>
			                                                				    {contribution.name}
			                                                				    <span>{contribution.user.firstName} {contribution.user.lastName}
			                                                                    { contribution.user._id === this.props.user._id &&
			                                                                        <button onClick={() => this.removeContribution(contribution)}>Remove Me</button>
			                                                                    }
			                                                                    </span>
			                                                				</li>
			                                                			)
			                                                	} )}
			                                                </ul>
		                                                </div>
		                                            </li>
		                                            
		                                        )
		                                })}
		                            </ul>
		                        }
		                        
		                    </div>
		                    <div className="event__attendees">
		                        <h2>Guest List</h2>
			                    <ul>
				                    { event.admins &&
			                           event.admins.map( (admin, index) => {
			                               return (
			                                     <li key={admin._id}><span className="required">{admin.firstName} {admin.lastName}</span></li>     
			                                   )
			                           }) 
				                    }
				                    { event.guests &&
			                           event.guests.map( (guest, index) => {
			                               return (
			                                     <li key={guest._id}>{guest.firstName} {guest.lastName}</li>     
			                                   )
			                           }) 
				                    }
			                    </ul>
		                    </div>
	                    </div>
                    </div>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default SingleEvent;
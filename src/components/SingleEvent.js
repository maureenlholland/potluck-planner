import React, { Component } from 'react';
import axios from 'axios';

import Header from './Header';

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
        return (
            <div>
                <Header setUser={this.props.setUser} />
                <main>
                    <h2>{event.title}</h2>
                    <div className="event__info">
                        {event.description}
                    </div>
                    <div className="event__image">
                        <img src={ event.image} alt={event.title}/>
                    </div>
                    <div className="event__menu">
                    {/*https://reactjs.org/docs/conditional-rendering.html*/}
                    { event.categories &&
                            <ul>
                                {event.categories.map( (category, index) => { 
                                    return (
                                            <li key={category._id} id={category._id}>
                                            {category.name}
                                            <button
                                            	type="button"
                                            	onClick={(e) => this.addInput(e, category)}
                                            >Add Item</button>
                                            { this.state.category &&
                                                <form onSubmit={this.handleSubmit}>
                                                    <label htmlFor="pl-contribution">
                                                        <input 
                                                            onChange={this.handleChange}
                                                            id="pl-contribution" 
                                                            name="contribution" 
                                                            value={this.state.contribution} />
                                                    </label>
                                                    <input 
                                                        type="submit"
                                                        value="Add contribution"
                                                    />
                                                </form>     
                                             }
                                             { category.suggestions.length > 0 &&
                                                <h4>Here's what we need:</h4>
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
                                                { category.contributions.length > 0 &&
                                                   <h4>Here's what we have:</h4>
                                                }
                                                <ul>
                                                	{category.contributions.map( (contribution, index) => {
                                                		return (
                                                				<li key={`contribution-${index}`}>
                                                				    {contribution.name}
                                                				    <span>{contribution.user.firstName} {contribution.user.lastName}</span>
                                                                    { contribution.user._id === this.props.user._id &&
                                                                        <button onClick={() => this.removeContribution(contribution)}>Remove</button>
                                                                    }
                                                				</li>
                                                			)
                                                	} )}
                                                </ul>
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
	                                     <li key={admin._id}>{admin.firstName} {admin.lastName}</li>     
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
                </main>
            </div>
        );
    }
}

export default SingleEvent;
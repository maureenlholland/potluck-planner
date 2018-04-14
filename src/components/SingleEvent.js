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
            	console.log(res);
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
     // Remove claim to suggestion
     // Claim Suggestion
     // Remove Contribution
     removeContribution = (contributionObj) => {
     	console.log(contributionObj);
        const contribution = contributionObj._id; 
        const category = contributionObj.categoryId; 
        const event = this.state.event._id;
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
     	console.log(category);
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
     	// find index of category for this contribution
     	const category = this.state.category;
     	const contribution = this.state.contribution;
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
                                                <ul>
                                                    {category.suggestions.map( (suggestion, index) => {
                                                    	if( suggestion.claimed ){
                                                    		return null;
                                                    	} else {
                                                    		return (
                                                					<li key={`suggestion-${index}`}>
                                                					    {suggestion.name}
                                                					    <button>Got it!</button>
                                                					</li> 
                                                    		    )
                                                    	}
                                                    } )}
                                                </ul>
                                                <ul>
                                                	{category.contributions.map( (contribution, index) => {
                                                		return (
                                                				<li key={`contribution-${index}`}>
                                                				    {contribution.name}
                                                				    <span>User: {contribution.user.firstName} {contribution.user.lastName}</span>
                                                                    { contribution.user._id === this.props.user._id &&
                                                                        <button onClick={() => this.removeContribution(contribution)}>Remove</button>
                                                                    }
                                                				</li>
                                                			)
                                                	} )}
                                                </ul>
                                                { this.state.category  &&
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
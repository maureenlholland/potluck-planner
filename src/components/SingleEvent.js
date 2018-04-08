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
        // 1. Get all events from database
        // Naming conventions - should axios url match router url? 
        axios
        // not that you don't need /event because .match automatically populates it
            .get(`${this.props.match.params.event}`)
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
     // Remove claim to suggestion
     // Claim Suggestion
     // Remove Contribution
     removeContribution = (suggestion, index) => {

     } 
     // Add input for Contribution addition to the proper category
     addInput= (e, id) => {
     	this.setState({ category: id });
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
     	const category = this.state.event.categories.findIndex(category => category._id === this.state.category);
     	const contribution = this.state.contribution;
     	console.log(category);
     	// Axios request to create Contribution (POST)
     	axios
     		.post('/contributions', {
				name: contribution,
				user: '5aa53b2d26745856bfaab7c9'
			})
			.then(doc => {
				console.log(doc);
				// Axios request to add contribution to event (PUT) **This feels like a problem waiting to happen**
				axios
					.put(`${this.props.match.params.event}`, {
						contribution: doc.data.payload._id,
						category: category
					})
					.then(doc => {
						console.log(doc);
					})
			});

     	// Clear input field
     	this.clearContribution();

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
                        <img src={event.image} alt={event.title}/>
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
                                            	onClick={(e) => this.addInput(e, category._id)}
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
                                                				    <span>User: {contribution.userId}</span>
                                                				</li>
                                                			)
                                                	} )}
                                                </ul>
                                                { this.state.category === category._id &&
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
                        
                    </div>
                </main>
            </div>
        );
    }
}

export default SingleEvent;
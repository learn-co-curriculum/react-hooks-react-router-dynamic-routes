import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { createIngredient } from '../../actions/ingredients'

export class IngredientsInput extends Component {
  constructor(props){
    super(props)
    this.state = {name: '', calories: ''}
  }
  handleOnIngredientNameChange(event){
    this.setState({name: event.target.value})
  }
  handleOnCaloriesChange(event){
    this.setState({calories: event.target.value})
  }
  handleOnSubmit(event){
    event.preventDefault()
    this.props.createIngredient(this.state)
  }
  render(){
    return(
      <form onSubmit={this.handleOnSubmit.bind(this)}>
      <p>
        <input type="text" onChange={this.handleOnIngredientNameChange.bind(this)} placeholder="Ingredient name"/>
      </p>
      <p>
        <input type="text" onChange={this.handleOnCaloriesChange.bind(this)} placeholder="calories"/>
      </p>
        <input type="submit" />
      </form>
    )
  }
}

export const ConnectedIngredientsInput = connect(null, mapDispatchToProps)(IngredientsInput)

function mapDispatchToProps(dispatch){
  return bindActionCreators({createIngredient: createIngredient}, dispatch)
}

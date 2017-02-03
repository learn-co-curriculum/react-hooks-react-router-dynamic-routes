import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { recipeFormAddIngredient } from '../../actions/ingredients'

export class AddIngredient extends Component {
  constructor(props){
    super(props)
  }
  handleOnClick(event){
    this.props.recipeFormAddIngredient(this.props.id)
  }
  render(){
    return(
      <div>
        <button onClick={this.handleOnClick.bind(this)}>{this.props.name}</button>
      </div>
    )
  }
}

export const ConnectedAddIngredient = connect(null, mapDispatchToProps)(AddIngredient)

function mapDispatchToProps(dispatch){
  return bindActionCreators({recipeFormAddIngredient: recipeFormAddIngredient}, dispatch)
}

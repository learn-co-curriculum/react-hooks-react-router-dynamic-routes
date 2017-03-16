import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPet } from '../actions';
import { browserHistory } from 'react-router';

class PetsNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }
  handleOnSubmit(event) {
    event.preventDefault();
    this.props.addPet(this.state);
    browserHistory.push('/pets');
  }
  handleOnNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  handleOnDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }
  render() {
    return (
      <div>
        <h2>Add a Pet</h2>
        <form onSubmit={(event) => this.handleOnSubmit(event)} >
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => this.handleOnNameChange(event)} />
          <input
            type="text"
            placeholder="Description"
            onChange={(event) => this.handleOnDescriptionChange(event)} />
          <input
            type="submit"
            value="Add Pet" />
        </form>
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPet: bindActionCreators(addPet, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(PetsNew);

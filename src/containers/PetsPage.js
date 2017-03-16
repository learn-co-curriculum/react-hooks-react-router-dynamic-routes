import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPets } from '../actions';
import { Link } from 'react-router';

class PetsPage extends Component {

  componentDidMount(){
    this.props.fetchPets();
  }

  render() {
    return (
      <div>
        <div className='col-md-4'>
          <ul>
            {this.props.pets.map(pet =>
              <li key={pet.id}>
                <Link to={`/pets/${pet.id}`}>{ pet.name }</Link>
              </li>
            )}
          </ul>
          <Link to="/pets/new">Add a Pet</Link>
        </div>
        {this.props.children}
      </div>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    pets: state.pets
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPets: bindActionCreators(fetchPets, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PetsPage);

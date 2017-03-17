import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators}  from 'redux';
import { fetchMovies } from '../actions';
import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {
  render() {
    return (
      <div>
        <MoviesList movies={this.props.movies} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);

import React from 'react';
import NavBar from './NavBar';
import PetsPage from '../containers/PetsPage';

export default (props) => {
  return (
    <div>
      <NavBar title="See All The Pets!" href="/pets"/>
      { props.children }
    </div>
  )
};

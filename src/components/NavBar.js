import React from 'react';
import { Link } from 'react-router';

export default (props) => {
  return(
    <nav className="navbar navbar-default">
      <Link
        className="navbar-brand"
        to={props.href}>
        {props.title}
      </Link>
    </nav>
  )
};

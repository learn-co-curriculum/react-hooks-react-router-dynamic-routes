import React from 'react';

export default (props) => {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            {props.title}
          </a>
        </div>
      </div>
    </nav>
  );
}

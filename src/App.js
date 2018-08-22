import React, { Component } from 'react';
import './App.css';
import {Grid, Row, Col} from 'react-bootstrap'; 
import Signup from './components/Signup';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
     <Grid>
  <Row className="show-grid">
    <Col xs={12} md={12}>
        <h1>Header</h1>
    </Col>
  </Row>

 <Row className="show-grid">
    <Col xs={12} md={12}>
        <Login />
    </Col>
  </Row>

  <Row className="show-grid">
    <Col xs={12} md={12}>
        <Signup />
    </Col>
  </Row>

  <Row className="show-grid">
    <Col xs={12} md={12}>
        <h1>Footer</h1>
    </Col>
  </Row>
</Grid>

    );
  }
}

export default App;

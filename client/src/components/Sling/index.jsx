import React, { Component } from 'react';
import io from 'socket.io-client/dist/socket.io.js';

import Sling from './Sling.jsx';

class SlingIndex extends Component {
  state = { 
    socket: null,
   }

  componentWillMount() {
    this.socket = io('http://localhost:4155', {
      query: {
        roomId: this.props.location.pathname.slice(1),
        player: this.props.location.state ? 1 : 2
      }
    });
    this.setState({ socket: this.socket });
    console.log('this is props.location', this.props);
  }

  render() {
    if (this.props.location.state) {
      return (
        <Sling socket={this.state.socket} player={this.socket.query.player} challenge={this.props.location.state.challenge}/>
      );
    } else {
      return (
        <Sling socket={this.state.socket} challenge={{}}/>
      );
    }
  }
}

export default SlingIndex;

import React, { Component } from 'react';
import CodeMirror from 'react-codemirror2';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import { throttle } from 'lodash';

import Stdout from './StdOut/index.jsx';
import EditorHeader from './EditorHeader';
import Button from '../globals/Button';

import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import './Sling.css';

class Sling extends Component {
  state = {
    id: null,
    ownerText: null,
    challengerText: null,
    text: '',
    challenge: '',
    stdout: ''
  }

  componentDidMount() {
    const { socket, challenge, player } = this.props;
    const startChall = typeof challenge === 'string' ? JSON.parse(challenge) : {}
    socket.on('connect', () => {
      socket.emit('client.ready', { challenge: startChall, player });
    });
    
    socket.on('server.initialState', ({ id, playerOneText, playerTwoText, challenge }) => {
      this.setState({
        id,
        ownerText: playerOneText,
        challengerText: playerTwoText,
        challenge
      });
    });

    socket.on('serverOne.changed', ({ text, player }) => {
      this.setState({ ownerText: text });
    });

    socket.on('serverTwo.changed', ({ text, player }) => {
      this.setState({ challengerText: text });
    });

    socket.on('server.run', ({ stdout, player }) => {
      this.props.player === player ? this.setState({ stdout }) : null;
    });

    window.addEventListener('resize', this.setEditorSize);
  }

  submitCode = () => {
    console.log(this.props);
    const { socket, player, } = this.props;
    const tests  = this.props.challenge.data.split(', ') //.slice(1, this.props.challenge.data.length - 1).split(',')
    const { ownerText, challengerText } = this.state;

    // const testCases = {
    //   input: [1, 2, 3],
    //   out: [6, 7, 8],
    // };
    console.log(tests);
    if (player === 1) {
      socket.emit('client.run', { text: ownerText, player, tests });
    } else {
      socket.emit('client.run', { text: challengerText, player, tests });
    }
  }

  handleChange = throttle((editor, metadata, value) => {
    const { player } = this.props;
    player === 1 ? this.props.socket.emit('clientOne.update', { text: value, player }) : this.props.socket.emit('clientTwo.update', { text: value, player });
  }, 250)

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);

  initializeEditor = (editor) => {
    this.editor = editor;
    this.setEditorSize();
  }

  render() {
    const { socket, player } = this.props;
    if (player === 1) {
      return (
        <div className="sling-container">
          <EditorHeader />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
              }}
              onChange={this.handleChange}
              />
          </div>
          <div className="stdout-container">
              {this.state.challenge.title || this.props.challenge.title}
              <br/>
              {this.state.challenge.content || this.props.challenge.content}
            <Stdout text={this.state.stdout}/>
            <Button
              className="run-btn"
              text="Run Code"
              backgroundColor="red"
              color="white"
              onClick={() => this.submitCode()}
            />
          </div>
          <div className="code2-editor-container">
            <CodeMirror 
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
                readOnly: true,
              }}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="sling-container">
          <EditorHeader />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
                readOnly: true
              }}
              />
          </div>
          <div className="stdout-container">
              {this.state.challenge.title || this.props.challenge.title}
              <br/>
              {this.state.challenge.content || this.props.challenge.content}
            <Stdout text={this.state.stdout}/>
            <Button
              className="run-btn"
              text="Run Code"
              backgroundColor="red"
              color="white"
              onClick={() => this.submitCode()}
            />
          </div>
          <div className="code2-editor-container">
            <CodeMirror 
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark'
              }}
              onChange={this.handleChange}
            />
          </div>
        </div>
      )
    }
  }
}

export default Sling;

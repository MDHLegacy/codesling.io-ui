import React, { Component } from 'react';
import axios from 'axios';

import Input from '../../globals/forms/Input';
import Button from '../../globals/Button/';
import Logo from '../../globals/Logo';

import './Auth.css';

class AddChallenge extends Component {
  state = { 
    title: '',
    content: '',
    difficulty: null,
    testCount: 1,
    input: {},
    output: {},
   }

  submitChallenge = async (e) => {
    e.preventDefault();
    const { title, content, difficulty, input1, output1 } = this.state;
    const id = localStorage.getItem('id');
    const body = {
      title,
      content,
      difficulty,
      user_id: id,
      type: 0
    }
    const result = await axios.post('http://localhost:3396/api/challenges/addChallenge', body);
    console.log('this is the result of sending the challenge', result);
    
    const tests = {
      data: Object.values(this.state.input).concat(Object.values(this.state.output)).join(', '),
      challenge_id: result.data[0].id,
    }
    console.log('this is the test object', tests);
    const testResults = await axios.post('http://localhost:3396/api/testCases', tests);
    console.log('this is the testResults', testResults);
    this.props.history.push('/home');
  }

  addTest(e) {
    console.log('this is the state when adding a test', this.state);
    e.preventDefault();
    this.setState({testCount: this.state.testCount + 1});    
  }

  handleChallengeInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }
  
  handleTestInput = (event) => {
    const { name, value } = event.target;
    this.setState({ input: Object.assign( {}, this.state.input, { [name] : value }) });
  }

  handleTestOutput = (event) => {
    const { name, value } = event.target;
    this.setState({ output: Object.assign( {}, this.state.output, { [name] : value }) });
  }

  render() {
    console.log(this.state.testCount);
    return (
      <div className="login-form-container">
        <Logo
          className="landing-page-logo"
        />
        <form className="auth-form">
          <Input
            name='title'
            type='title'
            placeholder={'enter title'}
            onChange={this.handleChallengeInput}
            />
          <Input
            name='content'
            type='content'
            placeholder={'enter content'}
            onChange={this.handleChallengeInput}
            />
          <Input 
            name='difficulty'
            type='difficulty'
            placeholder={'enter your difficulty'}
            onChange={this.handleChallengeInput}
            />
          {
            this.state.testCount > 0
            ?
            Array.apply(null, {length: this.state.testCount})
            .map(Number.call, Number)
            .map((testNum) => 
              <div>
                <Input 
                  name={`input${testNum}`}
                  type={`input${testNum}`}
                  placeholder={'enter input'}
                  onChange={(e) => this.handleTestInput(e, testNum)}
                  />
                <Input 
                  name={`output${testNum}`}
                  type={`output${testNum}`}
                  placeholder={'enter expected output'}
                  onChange={(e) => this.handleTestOutput(e, testNum)}
                  />
              </div>
            )
            :
            <div/>
          }  
          
          <Button
            backgroundColor="red"
            color="white"
            text="Add Test"
            onClick={this.addTest.bind(this)}
            />
          <Button
            backgroundColor="red"
            color="white"
            text="Add Challenge"
            onClick={(e) => this.submitChallenge(e)}
            />
        </form>
      </div>
    );
  }
}

export default AddChallenge;

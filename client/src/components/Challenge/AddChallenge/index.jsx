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
    input1: '',
    output1: '',
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
      data: input1 + ', ' + output1,
      challenge_id: result.data[0].id,
    }
    console.log('this is the test object', tests);
    const testResults = await axios.post('http://localhost:3396/api/testCases', tests);
    console.log('this is the testResults', testResults);
    this.props.history.push('/home');
  }

  handleChallengeInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
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
          <Input 
            name='input1'
            type='input1'
            placeholder={'enter input'}
            onChange={this.handleChallengeInput}
            />
          <Input 
            name='output1'
            type='output1'
            placeholder={'enter expected output'}
            onChange={this.handleChallengeInput}
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

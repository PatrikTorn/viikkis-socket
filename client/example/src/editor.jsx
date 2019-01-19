import React, { Component } from 'react'
import Editor from '../../src/main'
// import Editor from '../dist'
import io from 'socket.io-client';


class Main extends Component {
  constructor() {
    super();
    this.socket = io('http://viikkis.herokuapp.com');
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('get text', (value) => this.setState({value}));

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    this.socket.emit('get text');
    // this.setState({value});
  }

  handleChange = value => {
    this.setState({
      value
    });
    this.socket.emit('set text', value);
  }

  handleSave = () => {
    console.log('触发保存事件')
  }

  render() {
    const { value } = this.state

    const editorStyle = {
      boxShadow: '#999 0 0 12px',
      borderRadius: '4px'
    }

    return (
      <div style={editorStyle}>
        <Editor
          value={value}
          onChange={this.handleChange}
          onSave={this.handleSave}
        />
      </div>
    )
  }
}

export default Main

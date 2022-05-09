import React, { Component } from 'react'
import Editor from '../../components/Editor'

export default class OptionsText extends Editor {

  state = this.props.editState || OptionsText.editState

  render() {
    console.log(this);
    return (<>
      <input type="text" value={this.state.text} onInput={ev => {
        this.setState({ text: ev.target.value })
      }} />
      <br />
      <input type="color" value={this.state.color} onInput={ev => {
        this.setState({ color: ev.target.value })
      }} />
      <input type="color" value={this.state.bgColor} onInput={ev => {
        this.setState({ bgColor: ev.target.value })
      }} />
    </>)
  }

  static editState = {
    text: '',
    color: '#fff',
    bgColor: '#000'
  }
}



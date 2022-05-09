import React from 'react'
import Editor from '../../components/Editor'

export default class OptionsColor extends Editor {
  state = this.props.editState || OptionsColor.editState;

  render() {
    return (
      <input type="color" onInput={(ev) => {
        this.setState({ color: ev.target.value });
      }} value={this.state.color} />
    )
  }

  static editState = {
    color: '#000000'
  }
}
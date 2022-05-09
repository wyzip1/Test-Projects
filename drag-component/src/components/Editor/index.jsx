import { Component } from 'react'
import sub from '../../Subscribe'

class T extends Component { }

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this._setState = new T().setState;
  }

  setState(state, cb) {
    this._setState(state, () => {
      sub.emit(this.props.sub_id, { ...this.state });
      cb && cb()
    });
  }
}
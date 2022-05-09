import React, { Component, createRef } from 'react'
import sub from '../../Subscribe'

let direction;

export default class DragContainer extends Component {

  dom = createRef();

  render() {
    return (
      <div ref={this.dom}
        style={{ width: '100%' }}
        draggable="true"
        onClick={() => sub.emit('content_click', { editor: this.props.item.editor, editState: this.props.item.editState, editor_props: this.props.item.editor_props })}
        onDragStart={() => {
          sub.set('isNoDrop', true);
          sub.set('dragComponent', this.props.item);
        }}
        onDragEnd={() => {
          sub.set('isNoDrop', false);
          sub.remove_data('dragComponent');
          direction = undefined;
        }}
        onDragOver={dragOver(this.props.item, this.dom)}
      >
        {this.props.children}
      </div>
    )
  }

}

function dragOver(item, dom) {
  return ev => {
    if (!ev || !dom.current) return;
    const { top, height } = dom.current.getBoundingClientRect();
    let _top = ev.clientY - top;
    sub.set('dragComponent-insert', item);
    const max = 15;
    const multiple = 10;
    const threshold = height / multiple > max ? max : height / multiple;
    if (_top < (height / 2 - threshold) && direction !== 'up') {
      direction = 'up'
      sub.emit('insert', 'up');
    }
    else if (_top > (height / 2 + threshold) && direction !== 'down') {
      direction = 'down';
      sub.emit('insert', 'down');
    }
  }

}
import React from 'react'
import styles from './styles.module.css'
import { Icon } from 'zent'
import sub from '../../Subscribe'


export default function UseComponent({ type, name, component, editor, editState }) {
  return (
    <div
      className={styles['use-component']}
      draggable="true"
      onDragStart={() => {
        sub.set('component', { Component: component, key: guid(), Editor: editor, editState })
        sub.emit('changeDragState', true);
      }}
      onDragEnd={() => sub.emit('changeDragState', false)}
    >
      <Icon type={type} className={styles.icon} />
      <span>{name}</span>
    </div>
  )
}


function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
import React from 'react'

export default function Title({editState}) {

  return (
    <div style={{
      height: 45,
      lineHeight: '45px',
      fontSize: 18,
      backgroundColor: editState.bgColor,
      color: editState.color,
      textAlign: 'center'
    }}>
      {editState.text}
    </div>
  )
}

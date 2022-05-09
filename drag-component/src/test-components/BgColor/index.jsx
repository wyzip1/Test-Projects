import React from 'react'

export default function BgColor({ editState }) {

  // console.log('render', editState);

  return (
    <div style={{
      width: '100%',
      height: '500px',
      backgroundColor: editState.color
    }}>

    </div>
  )
}

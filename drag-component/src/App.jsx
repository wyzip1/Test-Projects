import React from 'react'
import DragComponent from './drag-component'
import './App.css'
import { menuList, phoneList } from './options'

function App() {

  return (
    <main className="main">
      <DragComponent menuList={menuList} phoneList={phoneList} />
    </main>
  )
}

export default App

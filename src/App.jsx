import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import Content from './components/Content.jsx'

const App = () => {
  return (
    <div className='w-full flex h-screen bg-slate-700 gap-2 sm:gap-5 py-2 px-1 sm:py-5 sm:px-3'>
      <Sidebar />
      <Content />
    </div>
  )
}

export default App

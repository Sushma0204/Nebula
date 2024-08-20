import React, { useState, useContext } from 'react'
import plus from '../assets/plus.png'
import chat from '../assets/chat.png'
import menu from '../assets/menu.png'
import help from '../assets/help.png'
import activity from '../assets/activity.png'
import setting from '../assets/setting.png'

import { Context } from '../context/ContextProvider'

const Sidebar = () => {

  const { onSendClick, prev, setCurrent, newchat } = useContext(Context)

  const load = async (prompt) => {
    setCurrent(prompt);
    await onSendClick(prompt);
  }
  const [visibility, setVisibility] = useState(false)
  const toggleVisibility = () => {
    setVisibility(prev => !prev)
  }


  return (
    <div className={`bg-gray-900 p-5 text-[12px] lg:text-[14px]  flex flex-col gap-5 rounded-xl text-slate-400 items-center sm:items-start sm:h-full transition-all duration-300 ease-in-out ${visibility ? 'w-5 sm:w-1/4' : 'w-5 sm:w-20'}`}>

      <div className='flex justify-center sm:justify-start h-10 w-20'>
        <img onClick={toggleVisibility} className='h-6 sm:h-7 sm:ml-2 hover:cursor-pointer' src={menu} alt="menu icon" />
      </div>

      <div className='flex justify-center sm:justify-start h-12 w-10 sm:w-32'>


        <div onClick={newchat} className={`flex items-center justify-center  sm:gap-3 sm:p-2 transition hover:-translate-y-1 hover:cursor-pointer hover:scale-105 sm:rounded-full sm:border-2 sm:border-slate-400 ${visibility ? 'w-10 ml-8 sm:w-40 sm:ml-0' : 'sm:w-10'}`}>
          <img className='h-5' src={plus} alt="plus icon" />
          {visibility && <p className='invisible sm:visible bg-clip-text font-semibold text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-blue-400 text-sm'>New chat</p>}
        </div>
      </div>

      {visibility && (
        <div className='flex-grow mt-10 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-hide mb-5 invisible sm:visible'>
          <p className='font-semibold text-slate-400 sm:text-sm md:text-base lg:text-base'>Recent</p>
          {prev.map((item, idx) => (
            <div key={idx} onClick={() => load(item)} className='flex p-2 items-center gap-3 cursor-pointer hover:bg-gray-700 rounded-full'>
              <img className='sm:h-5 lg:h-6' src={chat} alt="chat icon" />
              {visibility && <p className='text-white'>{item.slice(0, 11)}....</p>}
            </div>
          ))}
        </div>
      )}

      <div className='mt-auto  invisible sm:visible'>
        <div className='flex p-2 items-center gap-3 cursor-pointer hover:bg-gray-700 rounded-full hover:p-3'>
          <img className='h-6' src={help} alt="help icon" />
          {visibility && <p className='text-white'>Help</p>}
        </div>
        <div className='flex p-2 items-center gap-3 cursor-pointer hover:bg-gray-700 rounded-full hover:p-3 invisible sm:visible'>
          <img className='h-6' src={activity} alt="activity icon" />
          {visibility && <p className=' text-white'>Activity</p>}
        </div>
        <div className='flex p-2 items-center gap-3 cursor-pointer hover:bg-gray-700 rounded-full hover:p-3'>
          <img className='h-6' src={setting} alt="setting icon" />
          {visibility && <p className=' text-white'>Setting</p>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar

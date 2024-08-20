import React, { useState, useContext, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import avatar from '../assets/avatar.png'
import direction from '../assets/direction.png'
import food from '../assets/food.png'
import bulb from '../assets/bulb.png'
import code from '../assets/code.png'
import send from '../assets/send.png'
import stop from '../assets/stop.png'
import edit from '../assets/edit.png'
import copy from '../assets/copy.png'
import regenerate from '../assets/regenerate.png'
import nebula from '../assets/nebula.png'
import { Context } from '../context/ContextProvider'
import Voice from './Voice'
import { UserButton, SignIn } from '@clerk/clerk-react'

const Card = ({ text, imgSrc, altText, handleCard }) => (
  <div
    onClick={() => handleCard(text)}
    className='w-40 h-34 md:w-44 md:h-38 lg:w-44 lg:h-48 lg:p-4 rounded-3xl p-2 border border-slate-400 text-slate-400 flex flex-col transition hover:scale-105 hover:cursor-pointer hover: shadow-sm hover:shadow-blue-700'>
    <p className='text-sm p-2'>{text}</p>
    <img className='h-6 mt-auto ml-auto mr-2' src={imgSrc} alt={altText} />
  </div>
)

const Content = () => {
  const {
    onSendClick,
    input, setInput,
    current, setCurrent,
    show, newchat,
    load,
    result,
    isStopped,
    stopGeneration,
  } = useContext(Context)

  const { isSignedIn } = useUser()

  const [showSignIn, setShowSignIn] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(current)
  const [isAnimating, setIsAnimating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const handleSignInClick = () => setShowSignIn(true)
  const handleCloseSignIn = () => setShowSignIn(false)

  const handleCard = (text) => {
    setInput(text)
    onSendClick(text)
    setCurrent(text)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    setCurrent(editedText)
    setIsEditing(false)
    onSendClick(editedText)
  }

  const handleCancelClick = () => {
    setEditedText(current)
    setIsEditing(false)
  }

  const handleVoiceClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000)
  }

  const handleCopyClick = () => {
   
    const plainText = result
      .replace(/<\/p>/g, '\n\n')  
      .replace(/<\/h2>/g, '\n\n') 
      .replace(/<\/li>/g, '\n')   
      .replace(/<br \/>/g, '\n')  
      .replace(/<[^>]+>/g, '')
    
    navigator.clipboard.writeText(plainText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      })
  }
  
  
  const handleRegenerateClick = () => {
    onSendClick(current);
  }



  return (
    <div className='flex flex-col w-full p-3 rounded-xl bg-slate-900 text-white'>
      <nav className='flex justify-between items-center sm:px-5 sm:py-2 mb-10'>
        <div onClick={newchat} className='flex gap-1 sm:gap-2 items-center hover:cursor-pointer'>
          <img className='w-6 sm:w-8 md:w-10' src={nebula} alt="Logo Icon" />
          <p className='text-sm sm:text-xl md:text-2xl font-bold mr-3'>Nebula</p>
        </div>

        <div className='flex gap-3'>
          {isSignedIn ? (
            <UserButton />
          ) : (
            !showSignIn && (
              <button
                className='p-1 sm:p-2 border-2 border-blue-700 w-12 text-[9px] sm:text-sm text-slate-300 rounded-xl sm:w-20 md:w-30'
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            )
          )}
        </div>
      </nav>

      {showSignIn && (
        <>
          <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-10 rounded-2xl shadow-xl'>
              <button
                className='absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700'
                onClick={handleCloseSignIn}
              >
                &times;
              </button>
              <SignIn />
            </div>
          </div>
          <div className='fixed inset-0 bg-gray-800 bg-opacity-50 z-40'></div>
        </>
      )}

      <div className='flex flex-grow flex-col overflow-auto scrollbar-hide w-full md:w-10/12 mx-auto'>
        <div className='justify-center items-center'>
          {!show ? (
            <>
              <div className='mb-10 text-center'>
                <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white'>
                  <span className='text-blue-600 inline'>Hello,</span> How can I help you today?
                </p>
              </div>

              <div className='flex flex-wrap gap-5 justify-center'>
                <Card text="Can you suggest a unique outdoor activity to try on a weekend getaway?" handleCard={handleCard} imgSrc={direction} altText="Direction Icon" />
                <Card text="Suggest a fascinating historical topic or event to research?" handleCard={handleCard} imgSrc={bulb} altText="Bulb Icon" />
                <Card text="What’s an interesting recipe or food trend you think I should try?" handleCard={handleCard} imgSrc={food} altText="Food Icon" />
                <Card text="Best practices for optimizing the performance of a web application?" handleCard={handleCard} imgSrc={code} altText="Code Icon" />
              </div>
            </>
          ) : (
            <div className='flex flex-col items-start gap-5 px-2 sm:p-10 text-[12px] sm:text-[14px] md:text-[16px] w-full'>
              <div className='flex gap-3 items-start'>
                <div className='hidden sm:inline'>
                  {isSignedIn ? <UserButton /> : <img className='sm:w-9' src={avatar} alt="User Icon" />}
                </div>
                {isEditing ? (
                  <div className='relative'>
                    <div className='bg-slate-700 min-w-auto h-auto py-4 px-3 rounded-2xl flex flex-col'>
                      <textarea
                        className='bg-transparent border-none outline-none w-auto sm:w-[320px] md:w-[420px]  min-h-[auto] px-3  text-white scrollbar-hide resize-none'
                        type='text'
                        placeholder='Your prompt will be displayed here...'
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                      />
                      <div className='flex justify-end gap-2 mt-5 text-[10px]'>
                        <button
                          className='bg-blue-700 text-white rounded-xl p-2'
                          onClick={handleSaveClick}
                        >
                          Save
                        </button>
                        <button
                          className='border border-blue-600 text-white rounded-xl p-2'
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                ) : (
                  <p className='bg-slate-700 min-w-auto h-auto py-4 px-3 rounded-2xl sm:-mt-4 mb-3'>
                    {current}
                    <img
                      className='w-4 ml-3 inline cursor-pointer'
                      src={edit}
                      alt="Edit Icon"
                      onClick={handleEditClick}
                    />
                  </p>
                )}
              </div>
              <div className='flex gap-3 items-start'>
                <img className='w-0 sm:w-8' src={nebula} alt="Logo Icon" />
                {load ? (
                  <div className="ml-2 bg-slate-600 w-auto h-auto rounded-full p-3 flex gap-1">
                    <div className="w-1 h-1 rounded-full animate-pulse bg-white"></div>
                    <div className="w-1 h-1 rounded-full animate-pulse bg-white"></div>
                    <div className="w-1 h-1 rounded-full animate-pulse bg-white"></div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <p className='mt-0 sm:mt-2' dangerouslySetInnerHTML={{ __html: result }}></p>
                    <div className='flex gap-2'>
                      <img onClick={handleCopyClick} className='w-4 hover:scale-110 hover:cursor-pointer' src={copy} alt="Copy Icon" />
                      {copySuccess && <span className='text-[9px] w-10 h-4 flex items-center justify-center rounded-full bg-blue-700 text-white'>Copied!</span>}
                      <img onClick={handleRegenerateClick} className='w-4 hover:scale-125 hover:cursor-pointer' src={regenerate} alt="Regenerate Icon" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-center items-center mt-5'>
        <div className='flex flex-col gap-5 p-3 w-full sm:w-10/12 md:w-3/4 rounded-2xl h-34 border-2 border-slate-500 bg-slate-800 sticky bottom-0'>
          <div className='flex items-center justify-between'>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className='bg-slate-600 outline-none w-full h-full p-3 rounded-full placeholder:text-slate-200 text-[12px] sm:text-[14px] md:text-[16px]'
              type="text"
              placeholder='Enter your prompt here'
            />
            {input && (
              <img
                onClick={() => onSendClick(input)}
                className='h-6 cursor-pointer ml-3 transform hover:scale-105'
                src={send}
                alt="Send Icon"
              />
            )}
          </div>

          <hr className='border-blue-600' />
          <div className='flex items-center justify-between px-2'>
            <div className={`flex items-center px-4 w-14 sm:w-44 gap-2 h-10 rounded-full text-[12px] cursor-pointer transition-transform duration-300 ${isStopped ? 'bg-blue-700 hover:scale-105' : 'bg-slate-700 hover:scale-105 '
              }`}
              onClick={() => stopGeneration()}>
              <img

                className='h-6 cursor-pointer'
                src={stop}
                alt="Stop Icon"
              />
              <p className='invisible sm:visible'>{isStopped ? 'Response has stopped' : 'Stop Generating Response'}</p>
            </div>
            <Voice />
          </div>
        </div>
      </div>

      <div className='my-3'>
        <p className='text-center text-gray-500 text-[8px] sm:text-sm md:text-base'>
          Nebula may generate inaccurate information about people, places or facts, Model: Nebula AI v1.3
        </p>
      </div>
    </div>
  )
}

export default Content

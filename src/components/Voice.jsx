import React, { useEffect, useContext, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import voice from '../assets/voice.png';
import Lottie from 'lottie-react';
import animateVoice from '../assets/animateVoice.json';
import { Context } from '../context/ContextProvider';

const language = 'en-IN';

function Voice() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const { setInput } = useContext(Context);

  const handleStartListening = () => {
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ language, continuous: true });
      setIsAnimating(true);
    }
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsAnimating(false);
  };

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn('Browser does not support speech recognition');
    }
  }, [browserSupportsSpeechRecognition]);

  return (
    <div
      onClick={isAnimating ? handleStopListening : handleStartListening}
      className='flex items-center justify-center cursor-pointer px-4 overflow-hidden text-[12px] w-14 sm:w-36 h-10 bg-slate-700 rounded-full hover:scale-105 transition-transform duration-300'
    >
      {isAnimating ? (
        <div className='flex items-center justify-center'>
          <Lottie 
            animationData={animateVoice}
            loop={true}
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
          <p className='hidden sm:block ml-2'>Recording.....</p>
        </div>
      ) : (
        <div className='flex items-center'>
          <img
            className='w-5 h-5 object-contain cursor-pointer transform transition-transform duration-500 ease-in-out'
            src={voice}
            alt="Voice Icon"
          />
          <p className='hidden sm:block ml-2'>Start Recording</p>
        </div>
      )}
    </div>
  );
}

export default Voice;

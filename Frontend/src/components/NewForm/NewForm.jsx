import React, { useEffect, useRef } from 'react'
import './NewForm.css'

const NewForm = () => {
  const endRef= useRef(null);

  useEffect(()=>{
    if(endRef.current)
    endRef.current.scrollIntoView({behavior: "smooth"});
  },[])
  return (
    <>
    <div className="endChat" ref={endRef}></div>
    <form className='newForm'>
      <div className="endChat"></div>
      <label htmlFor="file">
        <img src="/attachment.png" alt="file" />
        <input type="file" id='file' hidden/>
      </label>
      <input type="text" placeholder='Ask me anything...'/>
      <button type='send'><img src="/arrow.png" alt="send" /></button>
    </form>
    </>
  )
}

export default NewForm
import React, { useEffect, useRef, useState } from 'react'
import './NewForm.css'
import Upload from '../Upload/Upload';
import { IKImage } from 'imagekitio-react';

const NewForm = () => {
  const endRef= useRef(null);

  const [img,setImg]= useState({
    isLoading:false,
    isError:"",
    onSuccess:false,
    dbData:{}
  })

  useEffect(()=>{
    if(endRef.current || imgRef.current)
    setTimeout(()=>{
    endRef.current.scrollIntoView({behavior: "smooth"});
      },250)
  },[img.isLoading,img.dbData])

  return (
    <>
    {img.isLoading && <div className='loading'>Loading...</div>}
    {img.dbData?.filePath &&
                  <IKImage urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} path={img.dbData?.filePath} width={300} transformation={[{width:300}]}/>
  }
    <div className="endChat" ref={endRef}></div>
    <form className='newForm'>
      <Upload setImg={setImg}/>
      <input type="text" placeholder='Ask me anything...'/>
      <button type='send'><img src="/arrow.png" alt="send" /></button>
    </form>
    </>
  )
}

export default NewForm
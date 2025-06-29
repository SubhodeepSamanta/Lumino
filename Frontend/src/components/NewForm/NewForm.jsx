import React, { useEffect, useRef, useState } from "react";
import "./NewForm.css";
import Upload from "../Upload/Upload";
import { IKImage } from "imagekitio-react";
import add from "../../Utils/Gemini";
import Markdown from 'react-markdown'
import apiRequest from "../../Utils/apiRequest";

const NewForm = () => {
  const endRef = useRef(null);
  const [question,setQuestion]= useState("");
  const [answer,setAnswer]= useState("");

  const [img, setImg] = useState({
    isLoading: false,
    isError: "",
    onSuccess: false,
    dbData: {},
    aiData:{}
  });

  useEffect(() => {
    if (endRef.current)
      endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [img.isLoading, img.dbData,answer,question]);

  useEffect(() => {
    if (endRef.current)
      setTimeout(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
      }, 400);
  }, [img.dbData]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const text = e.target.text.value;
  if (!text) return;
  setQuestion(text);
  setAnswer("thinking...");
  if (img.aiData && Object.keys(img.aiData).length > 0) {
    await add(
      [text,img.aiData],
      (live) => {
        setAnswer(live);
      } 
    );
  } else {
    await add([text], (live) => {
      setAnswer(live);
    });
  }
  
  const response= await apiRequest.post('/api/chats',{text});
  console.log(response);

  setImg({
    isLoading: false,
    isError: "",
    onSuccess: false,
    dbData: {},
    aiData:{}
  })
  e.target.reset();
};

  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
        path={img.dbData?.filePath}
        width={300}
        transformation={[{ width: 300 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      
      {answer && <div className="message"><Markdown>{answer}</Markdown></div>}

      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={(e)=>handleSubmit(e)}>
        <Upload setImg={setImg} />
        <input type="text" name="text" placeholder="Ask me anything..." autoComplete="off" />
        <button type="send">
          <img src="/arrow.png" alt="send" />
        </button>
      </form>
    </>
  );
};

export default NewForm;

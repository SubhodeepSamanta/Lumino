import React from 'react'
import './ChatPage.css'
import NewForm from '../../components/NewForm/NewForm'
import apiRequest from '../../Utils/apiRequest'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react'

const ChatPage = () => {

      const path= useLocation().pathname;
      const chatId= path.split('/').pop();
  
      const handleChatsFetch= async()=>{
          const response= await apiRequest.get(`/api/chats/${chatId}`);
          return response.data;
      }
  
    const { isPending, error, data } = useQuery({
      queryKey: ["chat",chatId],
      queryFn: handleChatsFetch
    });
  
    if (isPending) return "Loading...";
  
    if (error) return "An error has occurred: " + error.message;

  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chats">
          {
            data?.history?.map((message,i)=>(
              <React.Fragment key={i}>
              {message.img && (
                <IKImage 
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    path={message.img}
                    height={300}
                    width={400}
                    transformation={[{height:300, width:400}]}
                    loading='lazy'
                    />
              )}
              <div className={message.role==="user"? "message user" : "message"} key={i}>
                <Markdown>
                  {message.parts[0].text}
                </Markdown>
              </div>
              </React.Fragment>
            ))
          }
      {data && <NewForm data={data}/>}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
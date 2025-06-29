import React, { useRef } from 'react'
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import apiRequest from '../../Utils/apiRequest';

const urlEndpoint= import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey= import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
        try {
            const response = await apiRequest.get('/api/upload');
            const data= response.data;
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

const Upload = ({setImg}) => {
    const onError = err => {
        setImg(prev=> ({...prev,isLoading:false,isError:err}))
  console.log("Error", err);
};

const onSuccess = (res) => {
  setImg((prev) => ({ ...prev, isLoading: false, onSuccess:true , dbData: res }));
};

const onUploadProgress = progress => {
  console.log("Progress", progress);
};

const onUploadStart = evt => {
  setImg((prev) => ({ ...prev, isLoading: true, onSuccess:true}));
  const file= evt.target.files[0];
  const reader= new FileReader();
  reader.onloadend=()=>{
    setImg((prev) => ({ ...prev, isLoading: true, onSuccess:true, aiData:{
      inlineData:{
        data: reader.result.split(",")[1],
        mimeType: file.type
      }
    }}));
  }
  reader.readAsDataURL(file);
};

const uploadRef= useRef(null);

  return (
    <IKContext 
        publicKey={publicKey} 
        urlEndpoint={urlEndpoint} 
        authenticator={authenticator} 
      >
        <IKUpload
          fileName="test-upload.png"
          folder='/Lumino'
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{display:"none"}}
          ref={uploadRef}
        />
        <label htmlFor="file" onClick={()=>uploadRef.current.click()}>
                <img src="/attachment.png" alt="file" />
              </label>
    </IKContext>
  )
}

export default Upload
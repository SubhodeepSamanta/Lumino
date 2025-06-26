import React, { useRef } from 'react'
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';

const urlEndpoint= import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey= import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
        try {
            const response = await fetch("http://localhost:5600/auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

const Upload = ({setImg}) => {
    const onError = err => {
        setImg(prev=> ({...prev,isError:err}))
  console.log("Error", err);
};

const onSuccess = (res) => {
  console.log("Upload Success:", res); // Log the full response
  setImg((prev) => ({ ...prev, isLoading: false, onSuccess:true , dbData: res }));
};

const onUploadProgress = progress => {
  console.log("Progress", progress);
};

const onUploadStart = evt => {
  console.log("Start", evt);
  setImg((prev) => ({ ...prev, isLoading: true, onSuccess:true}));
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
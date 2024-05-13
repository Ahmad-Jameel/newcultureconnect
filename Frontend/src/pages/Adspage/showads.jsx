import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed and imported correctly

export default function ShowAds() {
  const [adContent, setAdContent] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/admin/display_ad');
        setAdContent(response.data);
      } catch (error) {
        console.error('Error fetching ad:', error);
      }
    };
  
    fetchAd(); 
    
    const intervalId = setInterval(fetchAd, 30000); 
  
    return () => clearInterval(intervalId); 
  }, []);
  

  const renderAdContent = () => {
    if (!adContent || !adContent.AdsGif) return null;
  
    const fileExtension = adContent.AdsGif.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'avi', 'mov'].includes(fileExtension);
    const isImage = ['gif', 'jpg', 'jpeg', 'png'].includes(fileExtension);
  
    if (isVideo) {
      return (
        <video src={`http://127.0.0.1:5000/${adContent.AdsGif}`} 
               autoPlay 
               muted 
               loop
               controls 
               className="w-full h-auto object-cover" />
      );
    } else if (isImage) {
      return <img src={`http://127.0.0.1:5000/${adContent.AdsGif}`} alt="Ad" className="w-full h-auto object-cover" />;
    }
    
    return null;
  };
  

  return (
    <div className="py-2 w-[300px] min-h-[40px] max-h-[400px] bg-gray-300 to-cyan-800 rounded-lg z-10 fixed bottom-2 right-2 flex justify-center">
      <div className="flex flex-col max-w-sm w-full p-2">
        <div className="flex justify-center items-center w-full">
          {renderAdContent()}
        </div>
      </div>
    </div>
  );
}

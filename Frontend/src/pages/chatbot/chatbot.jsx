import logo from "../../assets/logo.png";
import React, { useState, useRef, useEffect } from 'react';
import axios from '../../axios'; // Make sure to import axios

export default function Chatbot() {
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [newMessage, setNewMessage] = useState(''); // Stores the new message input by the user
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatContainerRef = useRef(null); // Ref for the chat container
  const [statusMessage, setStatusMessage] = useState('');

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages
    
    const userMessage = { role: 'user', content: newMessage };

    try {
      // Update messages to include the user's message
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setIsLoading(true); // Set loading state to true while waiting for response

      const response = await axios.post('/user/gpt', { promptinput: newMessage });
      const { response: botResponse } = response.data;

      if (response.status === 200) {
        // Display bot's response in chat
        setMessages(prevMessages => [...prevMessages, { role: 'bot', content: botResponse }]);
        setStatusMessage('');
      } else {
        // Display status message in chat and set statusMessage
        let errorMessage = '';
        switch (response.status) {
          case 400:
            setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Sorry, I can't answer this. I can only answer queries related to Pakistani culture, festivals, and places. Validation Response: `}])  ;
            break;
          case 401:
            setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Kindly please reenter your query`}])  ;
            break;
          case 500:
            setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `An error occurred. Kindly reenter your query`}])  ;
            break;
          default:
            setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Kindly be more specific`}])  ;
        }
        setMessages(prevMessages => [...prevMessages, { role: 'bot', content: errorMessage }]);
        setStatusMessage(errorMessage);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    //   setStatusMessage('Kindly be more specific i can only answer pakistan related quries');
    switch (error.response.status) {
        case 400:
          setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Sorry, I can't answer this. I can only answer queries related to Pakistani culture, festivals, and places.`}])  ;
          break;
        case 401:
          setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Kindly please reenter your query`}])  ;
          break;
        case 500:
          setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `An error occurred. Kindly reenter your query`}])  ;
          break;
        default:
          setMessages(prevMessages => [...prevMessages, {role: 'bot', content: `Kindly be more specific`}])  ;
      }
    } finally {
      setIsLoading(false); // Set loading state to false after response is received
    }

    setNewMessage(''); // Clear the input after sending
  };


  // Scroll to bottom of chat container on messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{borderRadius:10}} className="py-2 w-[300px] min-h-[400px] max-h-[400px] bg-dark to-cyan-800 rounded-lg z-10 fixed bottom-2 right-2 flex justify-center">
      <div className="flex flex-col max-w-sm w-full ">
      <div style={{height:70, backgroundColor:"black", borderRadius:"10px 10px 0px 0px"}}>
        <h5 style={{fontSize:22}} className="text-white py-1 text-center">Your AI Chat bot</h5>

      </div>
        
     
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto max-h-96 mb-4 py-4 container"
          style={{ overflowY: 'hidden' }} 
        >
    
          <p style={{ color: "white" }}>kindly be specific while entering your query</p>
         
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-white text-black' : 'bg-secondary text-white'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="spinner-border text-blue-500" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {statusMessage && (
              <div className="flex justify-center text-red-500">{statusMessage}</div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center h-8 p-2">
          <input
            type="text"
            className="border-2 border-gray-300 bg-white text-blue-500 placeholder:text-blue-500 rounded-lg p-2 w-full mr-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

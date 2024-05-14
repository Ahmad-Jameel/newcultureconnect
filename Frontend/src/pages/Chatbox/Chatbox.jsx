import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import defaultProfilePic from "../../assets/profileIcon.png";
import "../Chatbox/Chatbox.css";

export default function Chatbox() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const baseURL = "http://127.0.0.1:5000/";

  const [isCalling, setIsCalling] = useState(false);
const [isReceivingCall, setIsReceivingCall] = useState(false);
const [callerId, setCallerId] = useState(null);
const [localStream, setLocalStream] = useState(null);
const [remoteStream, setRemoteStream] = useState(null);
const [peerConnection, setPeerConnection] = useState(null);
const [receivedOffer, setReceivedOffer] = useState(null);  // State to store received offer

const senderId = JSON.parse(localStorage.getItem("user")).id;

const sortUsersByLastMessageTime = (usersArray) => {
  return [...usersArray].sort((a, b) => b.lastMessageTime - a.lastMessageTime);
};

const startVideoCall = (receiverId) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
          setLocalStream(stream);
          const newPeerConnection = createPeerConnection(receiverId, stream);
          setPeerConnection(newPeerConnection);
          setIsCalling(true);

          newPeerConnection.createOffer().then(offer => {
              newPeerConnection.setLocalDescription(offer);
              socket.emit('offer', { receiverId, offer });
          })
          .catch(error => console.error("Error creating offer:", error));
      })
      .catch(error => console.error("Error accessing media devices:", error));
};

// Function to accept a video call
const acceptVideoCall = () => {
  if (!receivedOffer) return;  // Check if there is an offer to accept

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      setLocalStream(stream);
      const newPeerConnection = new RTCPeerConnection();

      stream.getTracks().forEach(track => newPeerConnection.addTrack(track, stream));

      newPeerConnection.onicecandidate = event => {
        if (event.candidate && socket) {
          socket.emit('ice_candidate', { receiverId: callerId, candidate: event.candidate });
        }
      };

      newPeerConnection.ontrack = event => {
        setRemoteStream(event.streams[0]);
      };

      setPeerConnection(newPeerConnection);

      const offerDescription = new RTCSessionDescription(receivedOffer);
      newPeerConnection.setRemoteDescription(offerDescription)
        .then(() => {
          newPeerConnection.createAnswer()
            .then(answer => {
              newPeerConnection.setLocalDescription(answer);
              socket.emit('accept_call', { senderId, callerId, answer });
              setIsCalling(true);
            })
            .catch(error => console.error("Error creating answer:", error));
        })
        .catch(error => console.error("Error setting remote description:", error));

      setIsReceivingCall(false);
      setIsCalling(true);  // Indicate that the call is active
    })
    .catch(error => console.error("Error accessing media devices:", error));
};




// Function to create a new peer connection
const createPeerConnection = (userId, stream) => {
  const newPeerConnection = new RTCPeerConnection();
  stream.getTracks().forEach(track => newPeerConnection.addTrack(track, stream));

  newPeerConnection.onicecandidate = event => {
      if (event.candidate) {
          socket.emit('ice_candidate', { receiverId: userId, candidate: event.candidate });
      }
  };

  newPeerConnection.ontrack = event => {
      setRemoteStream(event.streams[0]);
  };

  return newPeerConnection;
};

useEffect(() => {
  if (socket) {
    socket.on('receive_message', (message) => {
      setMessages(prev => ({
        ...prev,
        [message.receiverId]: message.senderId !== senderId ? [...(prev[message.receiverId] || []), message] : (prev[message.receiverId] || []),
          [message.senderId]: [...(prev[message.senderId] || []), message]
      }));

      // Update last message time for the user involved in the message and sort users
      setUsers(prev => {
        const updatedUsers = prev.map(user =>
          user.UserID === message.senderId || user.UserID === message.receiverId
            ? { ...user, lastMessageTime: new Date() }
            : user
        );
        return sortUsersByLastMessageTime(updatedUsers);
      });
    });
  }
}, [socket, senderId]);


  useEffect(() => {
    const newSocket = io(baseURL);
    setSocket(newSocket);

    newSocket.on('receive_message', (message) => {
      setMessages(prev => ({
          ...prev,
          // Update the receiver's messages only if the receiver is not the sender
          [message.receiverId]: message.senderId !== senderId ? [...(prev[message.receiverId] || []), message] : (prev[message.receiverId] || []),
          // Always update the sender's messages
          [message.senderId]: [...(prev[message.senderId] || []), message]
      }));
  });

    newSocket.on('load_messages', (messages) => {
        const updatedMessages = messages.reduce((acc, message) => {
            const { sender_id, Receiver_Id } = message;
            return {
                ...acc,
                [sender_id]: [...(acc[sender_id] || []), message],
                [Receiver_Id]: [...(acc[Receiver_Id] || []), message]
            };
        }, {});
        setMessages(prev => ({ ...prev, ...updatedMessages }));
    });

    newSocket.on('receive_call', ({ senderId }) => {
        setCallerId(senderId);
        setIsReceivingCall(true);
    });

    newSocket.on('call_accepted', () => {
        const newPeerConnection = createPeerConnection(callerId, localStream);
        setPeerConnection(newPeerConnection);
        newPeerConnection.createAnswer()
            .then(answer => {
                newPeerConnection.setLocalDescription(answer);
                socket.emit('accept_call', { senderId, callerId, answer });
            })
            .catch(error => console.error("Error creating answer:", error));
    });

    newSocket.on('receive_offer', ({ offer }) => {
      setCallerId(senderId);
      setIsReceivingCall(true);
      setReceivedOffer(offer);  // Store the received offer
  
      // Automatically initiate setting up the media and peer connection
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
              const newPeerConnection = createPeerConnection(senderId, stream);
              newPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
              setPeerConnection(newPeerConnection);
              setLocalStream(stream);
  
              newPeerConnection.createAnswer().then(answer => {
                  newPeerConnection.setLocalDescription(answer);
                  newSocket.emit('answer', { senderId, answer });
              })
              .catch(error => console.error("Error creating answer:", error));
          })
          .catch(error => console.error("Error accessing media devices:", error));
  });
  

    newSocket.on('receive_answer', ({ answer }) => {
        const desc = new RTCSessionDescription(answer);
        peerConnection.setRemoteDescription(desc).catch(error => console.error("Error setting remote description:", error));
    });

    newSocket.on('ice_candidate', ({ candidate }) => {
        peerConnection.addIceCandidate(candidate);
    });

    newSocket.on('call_ended', () => {
        setIsCalling(false);
        setIsReceivingCall(false);
        setCallerId(null);
        setLocalStream(null);
        setRemoteStream(null);
        setPeerConnection(null);
    });

    newSocket.emit('join_room', senderId);

    return () => {
        newSocket.close();
        // Make sure to clean up event listeners here
        newSocket.off('receive_message');
        newSocket.off('load_messages');
        newSocket.off('receive_call');
        newSocket.off('call_accepted');
        newSocket.off('receive_offer');
        newSocket.off('receive_answer');
        newSocket.off('ice_candidate');
        newSocket.off('call_ended');
    };
}, [baseURL, senderId]);

const endVideoCall = () => {
  if (peerConnection) {
    peerConnection.close();
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }
  setIsCalling(false);
  setIsReceivingCall(false);
  setCallerId(null);
  setLocalStream(null);
  setRemoteStream(null);
  setPeerConnection(null);
};

  

useEffect(() => {
  async function fetchUsers() {
    try {
      const response = await axios.get("/user/chatbox", { params: { sender_id: senderId } });
      if (response.data.users.length > 0) {
        const usersWithTimestamp = response.data.users.map(user => ({ ...user, lastMessageTime: new Date(0) })); // Initialize with an old date
        setUsers(sortUsersByLastMessageTime(usersWithTimestamp));
        setActiveChat(response.data.users[0].UserID);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  }

  fetchUsers();
}, [senderId]);

  const handleSelectUser = (userId) => {
    setActiveChat(userId);
    fetchChatHistory(userId);
  };

  useEffect(() => {
    if (users.length > 0) {
      setActiveChat(users[0].UserID);
    }
  }, [users]);
  
  useEffect(() => {
    if (activeChat) {
      fetchChatHistory(activeChat);
    }
  }, [activeChat]);
  
  const fetchChatHistory = async (userId) => {
    try {
      const { data } = await axios.get(`${baseURL}user/chat_history/${userId}`, {
        params: { sender_id: senderId }
      });
      setMessages(prev => ({
        ...prev,
        [userId]: data.map(msg => ({
          senderId: msg.sender_id,
          receiverId: msg.Receiver_Id,
          message: msg.message,
          createdAt: msg.createdAt
        }))
      }));
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !activeChat) return;
    const messageData = {
      senderId,
      receiverId: activeChat,
      message: currentMessage,
      createdAt: new Date().toISOString() // Add the current timestamp
    };
    socket.emit('send_message', messageData);
    setCurrentMessage("");
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), messageData]
    }));
  };

  const activeUser = users.find(user => user.UserID === activeChat);

  return (
    <div className="body">
      <div className="container" style={{
        position: "relative", width: "1396px", maxWidth: "100%", height: "calc(100vh - 40px)", background: "#cecaca",
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.06)", display: "flex"
      }}>
        <div className="leftside">
          <div className="search_chat">
            <div>
              <input type="text" placeholder="Search or start a new chat" />
              <ion-icon name="search-outline"></ion-icon>
            </div>
          </div>
          <div className="chatlist">
  {users.map(user => (
    <div key={user.UserID} className={`block ${activeChat === user.UserID ? "active" : ""}`} onClick={() => handleSelectUser(user.UserID)}>
      <div className="imgbx">
        <img
          src={user.Profile_pic ? `${baseURL}${user.Profile_pic}` : defaultProfilePic}
          className="cover"
          alt="User"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="details">
        <div className="listhead">
          <h6>{user.Name}</h6>
          <p className="time">{new Date(user.lastMessageTime).toLocaleTimeString()}</p>
        </div>
        <div className="message_p">
          <p>{messages[user.UserID]?.slice(-1)[0]?.message || "Start a conversation"}</p>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>

        <div className="rightside">
          {activeChat && messages[activeChat] ? (
            <>
              <div className="header" style={{ position: "relative", width: "100%", height: "60px", background: "#cecaca", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
                <div className="imgtext">
                  <div className="userimg">
                    <img
                      src={activeUser.Profile_pic ? `${baseURL}${activeUser.Profile_pic}` : defaultProfilePic}
                      className="cover"
                      alt="User1"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <h6>{users.find(user => user.UserID === activeChat)?.Name}</h6>
                </div>

                <ul className="Nav_icons">
                  <li><ion-icon name="search-outline"></ion-icon></li>
                  <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
                </ul>
              </div>

              <div className="chatBox">
                {messages[activeChat].map((msg, index) => (
                  <div key={index} className={`message ${msg.senderId === senderId ? "my_message" : "frnd_message"}`}>
                    <p>{msg.message} <span>{new Date(msg.createdAt).toLocaleTimeString()}</span></p>
                    
                  </div>
                ))}
              </div>

              <div className="chatbox_input">

                <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder="Type a message" />
                
                <button onClick={handleSendMessage}>Send</button>
              </div>
              <div className="video-call-button">
              <button onClick={() => startVideoCall(activeChat)}>Start Video Call</button>
            </div>

            {isCalling && (
  <div className="video-call">
    <video className="local-video" ref={(ref) => ref && (ref.srcObject = localStream)} autoPlay />
    <video className="remote-video" ref={(ref) => ref && (ref.srcObject = remoteStream)} autoPlay />
    <button onClick={() => endVideoCall()}>End Call</button>
  </div>
)}

            {/* Accept video call button */}
            {isReceivingCall && (
              <div className="accept-call-button">
                <button onClick={() => acceptVideoCall()}>Accept Video Call</button>
              </div>
            )}
            </>
          ) : (
            <div className="header" style={{ position: "relative", width: "100%", height: "60px", background: "#cecaca", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
              <p>No user selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







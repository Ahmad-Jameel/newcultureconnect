import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

export default function Home() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [reportOptionVisible, setReportOptionVisible] = useState({});
    const [isListeningAnimationVisible, setListeningAnimationVisible] = useState(false);
    const baseURL = 'http://localhost:5000/';

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${baseURL}native/allblogs`);
                setBlogs(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Failed to fetch blogs: ", error);
            }
        };

        fetchBlogs();
    }, []);

    const navigateToBlogs = (blogId) => {
        navigate("/user/seeBlogs", { state: { blogId: blogId } });
    };

    const toggleReportOption = (blogId) => {
        setReportOptionVisible(prev => ({
            ...prev,
            [blogId]: !prev[blogId],
        }));
    };

    const handleReportClick = (blog) => {
        const postId = blog.BlogsID;
        const postType = 'blog';

        console.log("----------blogID", postId)

        navigate('/user/Feedback', { state: { postId, postType } });
    };

    const [listening, setListening] = useState(false);
    const recognition = new window.webkitSpeechRecognition();

    useEffect(() => {
        recognition.continuous = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript;
            console.log('Result:', command);
        };
        
        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = () => {
        setListeningAnimationVisible(true);
        setListening(true);
        recognition.start();
        console.log('Listening...');
    
        recognition.onend = () => {
            setListeningAnimationVisible(false);
            console.log('Stopped listening.');
        };
    
        recognition.onerror = (event) => {
            console.error('Error:', event.error);
            setListeningAnimationVisible(false);
        };
    };

    recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript;
    console.log('Result:', command);
    // Process the command here
    // For example, you can send the command to a backend API for further processing
    sendCommandToBackend(command);
};

    const sendCommandToBackend = async (command) => {
        try {
            const response = await axios.get(`${baseURL}native/voicecommandtogetblogs`, {
                params: { voiceCommand: command }
            });
            console.log('Blogs based on voice command:', response.data);
            // Update state with the fetched blogs
            setBlogs(response.data);
        } catch (error) {
            console.error("Failed to fetch blogs based on voice command: ", error);
        }
    };
    

    return (
        <div>
            <style>
            {`
            .listening-animation {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 255, 255, 0.8);
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: fadeInOut 1s infinite alternate;
            }

            @keyframes fadeInOut {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
            `}
            </style>
            
            <div className="voice-icon" onClick={startListening}>
    <i className="fas fa-microphone"></i>
    {isListeningAnimationVisible && <div className="listening-animation">Listening...</div>}
</div>
          <br/>
          <h1 className="mb-3 mb-xl-4 text-uppercase text-center my-5" style={{fontSize: '38px'}}> Blogs </h1>
          <hr />
          <div className="container overflow-hidden">
          
              <div className="row gy-4 gy-lg-0">
                
                  {blogs.map((blog) => (
                      <div className="col-12 col-lg-4 mt-5" key={blog.id}>
                        <div className='text-end mt-3'>
                                              <button className="btn" onClick={() => toggleReportOption(blog.id)}>
                                                  <i className="fas fa-ellipsis-v"></i>
                                              </button>
                                              {reportOptionVisible[blog.id] && (
                                                  <div>
                                                      <button className="btn btn-danger" onClick={() => handleReportClick(blog)}>Report</button>
                                                  </div>
                                              )}
                                          </div>
                          <article>
                              <div className="card border-0">
                                  <img className="card-img-top img-fluid m-0" loading="lazy" src={`${baseURL}${blog.Blog_Title_Image}`} alt=""/>
                                  <div className="card-body border bg-white p-4">
                                      <div className="entry-header mb-3">
                                          <h2 className="card-title entry-title h4 mb-0">
                                              <a className="link-dark text-decoration-none" href="#!">{blog.Blog_Title}</a>
                                          </h2>
                                      </div>
                                      <div className='text-justify-center'>
                                          <p className="card-text entry-summary text-secondary mb-3">
                                              {blog.Blog_Content.split(" ").slice(0, 100).join(" ")}...
                                          </p>
                                          <div className='text-center'>
                                              <a href="#!" className="btn bsb-btn-2xl btn-primary " style={{fontSize: 20}} onClick={() => navigateToBlogs(blog.id)}>Read More</a>
                                          </div>
                                          {/* Three-dotted button for report */}
                                          
                                      </div>
                                  </div>
                              </div>
                          </article>
                      </div>
                  ))}
                  <div className='mb-5'> </div>
              </div>
          </div>
        </div>
      );
  }
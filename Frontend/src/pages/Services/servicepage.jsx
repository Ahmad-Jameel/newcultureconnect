import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import pic2 from "../../assets/user.jpeg";
import axios from "../../axios";

export default function ServicePage() {
  const [natives, setNatives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNatives = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/native/all_native_profile_for_service"
        );
        setNatives(response.data);
      } catch (error) {
        console.error("Failed to fetch native profiles:", error);
      }
    };

    fetchNatives();
  }, []);

  return (
    <div>
      <br />
      <h1
        className="mb-3 title mb-xl-4 text-uppercase text-center my-5"
        style={{ fontSize: "38px" }}
      >
        Services
      </h1>

      <div className="container">
        <div className="row my-5">
          {natives.map((native) => (
            <div className="col-md-4" key={native.UserID}>
              <div className="card mb-3" style={{borderRadius:20}}>
                <div className="row g-0">
                  <div className="col-lg-4">
                      <img
                      style={{height:"100%"}}
                        className="img-fluid"
                        loading="lazy"
                        src={
                          native.Profile_pic
                            ? `http://127.0.0.1:5000/${native.Profile_pic.replace(
                                "\\",
                                "/"
                              )}`
                            : pic2
                        }
                        alt={native.Name}
                      />
                  </div>
                  <div className="col-lg-8">
                    <div className="card-body">
                    <h4 style={{fontSize:24,}} className="mb-1">{native.Name}</h4>
                        {/* <p className="text-secondary mb-0">{native.service}</p> */}

                        <p style={{}}>{native.service.substring(0, 30)}</p>
                        <div className="my-3">
                          <a
                            href="#!"
                            className="btn bsb-btn-2xl btn-dark "
                            style={{ fontSize: 20 }}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/user/NativeProfile", {
                                state: { userId: native.UserID },
                              }); // Passing userID in state
                            }}
                          >
                            Read More
                          </a>
                        </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

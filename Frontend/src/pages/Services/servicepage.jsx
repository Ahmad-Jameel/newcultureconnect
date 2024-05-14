import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import pic2 from "../../assets/user.jpeg";
import axios from "../../axios";

export default function ServicePage() {
  const [natives, setNatives] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDetails, setReportDetails] = useState({ nativeId: "", reporterId: "", reason: "" });
  const [reportError, setReportError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNatives = async () => {
      try {
        const currentUserId = JSON.parse(localStorage.getItem("user")).id;
        const response = await axios.get(
          `http://127.0.0.1:5000/native/all_native_profile_for_service?userId=${currentUserId}`
        );
        setNatives(response.data);
      } catch (error) {
        console.error("Failed to fetch native profiles:", error);
      }
    };

    fetchNatives();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/native/search?query=${searchQuery}`
      );
      setNatives(response.data);
    } catch (error) {
      console.error("Failed to search native profiles:", error);
    }
  };

  const toggleReportForm = (nativeId) => {
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;
    setReportDetails({ ...reportDetails, nativeId, reporterId: currentUserId });
    setShowReportForm(nativeId);
    setReportError("");
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const wordCount = reportDetails.reason.trim().split(/\s+/).length;
    if (wordCount < 10) {
      setReportError("The reason for the report must be at least 10 words.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/native/report", reportDetails);
      setShowReportForm(false);
      setReportDetails({ ...reportDetails, reason: "" });
    } catch (error) {
      console.error("Failed to report native:", error);
    }
  };

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
          <form onSubmit={handleSearch} className="d-flex mb-4">
            <input
              type="text"
              placeholder="Search by Name or Service"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mr-2"
            />
            <button type="submit" className="btn btn-primary">
              <i className="material-icons">
                <ion-icon name="search-outline"></ion-icon>
              </i>
            </button>
          </form>
          {natives.map((native) => (
            <div className="col-md-4" key={native.UserID}>
              <div className="card mb-3" style={{ borderRadius: 20 }}>
                <div className="row g-0">
                  <div className="col-lg-4 position-relative">
                    <button
                      className="btn btn-danger btn-sm position-absolute"
                      style={{ top: 10, left: 10 }}
                      onClick={() => toggleReportForm(native.UserID)}
                    >
                      Report
                    </button>
                    <img
                      style={{ height: "100%" }}
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
                      <h4 style={{ fontSize: 24 }} className="mb-1">
                        {native.Name}
                      </h4>
                      <p>{native.service.substring(0, 30)}</p>
                      <div className="my-3">
                        <a
                          href="#!"
                          className="btn bsb-btn-2xl btn-dark"
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
                      {showReportForm === native.UserID && (
                        <div
                          className="report-form-container mt-3"
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                          }}
                        >
                          <h5>Report Native Profile</h5>
                          <form onSubmit={handleReportSubmit}>
                            <div className="form-group">
                              <label htmlFor="reason">Reason for Report:</label>
                              <textarea
                                id="reason"
                                className="form-control"
                                value={reportDetails.reason}
                                onChange={(e) => setReportDetails({ ...reportDetails, reason: e.target.value })}
                                required
                              />
                            </div>
                            {reportError && <p style={{ color: "red" }}>{reportError}</p>}
                            <button type="submit" className="btn btn-danger mt-3">
                              Submit Report
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary mt-3 ml-2"
                              onClick={() => setShowReportForm(false)}
                            >
                              Cancel
                            </button>
                          </form>
                        </div>
                      )}
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

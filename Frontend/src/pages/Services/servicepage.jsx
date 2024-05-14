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
  const [ratings, setRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [ratingErrors, setRatingErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNativesAndRatings = async () => {
      try {
        const currentUserId = JSON.parse(localStorage.getItem("user")).id;

        // Fetch native profiles
        const response = await axios.get(
          `http://127.0.0.1:5000/native/all_native_profile_for_service?userId=${currentUserId}`
        );
        setNatives(response.data);

        // Fetch average ratings for natives
        const avgRatingsResponse = await axios.get(
          `http://127.0.0.1:5000/native/average_ratings`
        );
        const avgRatingsData = avgRatingsResponse.data.reduce((acc, rating) => {
          acc[rating.nativeId] = parseFloat(rating.averageRating).toFixed(1);
          return acc;
        }, {});
        setAverageRatings(avgRatingsData);

      } catch (error) {
        console.error("Failed to fetch native profiles or ratings:", error);
      }
    };

    fetchNativesAndRatings();
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
      if (error.response && error.response.status === 400) {
        setReportError(error.response.data); // Display the error message from the backend
      } else {
        console.error("Failed to report native:", error);
      }
    }
  };

  const handleRatingChange = async (nativeId, rating) => {
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;
    try {
      await axios.post("http://127.0.0.1:5000/native/rate", { nativeId, userId: currentUserId, rating });
      setRatings({ ...ratings, [nativeId]: rating });
      setRatingErrors({ ...ratingErrors, [nativeId]: "" }); // Clear any previous errors for this native
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRatingErrors({ ...ratingErrors, [nativeId]: error.response.data }); // Display the error message for this native
      } else {
        console.error("Failed to rate native:", error);
      }
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex space-x-1 lg:space-x-2">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-5 h-auto fill-current text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/>
          </svg>
        ))}
        {halfStar && (
          <svg
            key="half"
            className="w-5 h-auto fill-current text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="#d1d5db"/>
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-5 h-auto fill-current text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/>
          </svg>
        ))}
      </div>
    );
  };

  const renderRatingStars = (nativeId) => {
    const currentRating = ratings[nativeId] || 0;
    const ratingError = ratingErrors[nativeId] || "";
    const averageRating = averageRatings[nativeId] || 0;
    return (
      <div className="flex flex-col items-center bg-white p-8 shadow-lg shadow-slate-200 rounded-lg w-auto space-y-2 lg:space-y-3">
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} onClick={() => handleRatingChange(nativeId, value)}>
              <svg className={`w-5 h-auto fill-current ${currentRating >= value ? "text-yellow-500" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/>
              </svg>
            </button>
          ))}
          <span className="text-slate-400 font-medium ml-2">Give rating</span>
        </div>
        
        <div className="flex items-center">
          {renderStars(parseFloat(averageRating))}
          <span className="text-slate-400 font-medium ml-2">Total Rating</span>
        </div>
        {ratingError && <p style={{ color: "red" }}>{ratingError}</p>}
      </div>
    );
  };

  return (
    <div>
      <br />
      <h1 className="mb-3 title mb-xl-4 text-uppercase text-center my-5" style={{ fontSize: "38px" }}>
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
                      {renderRatingStars(native.UserID)}
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

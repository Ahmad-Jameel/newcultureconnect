import React, { useState, useEffect } from "react";
import picture1 from "../../assets/background.jpg";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [messageError, setMessageError] = useState("");

  const location = useLocation();
  const { postId, postType } = location.state || {};

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      try {
        const response = await axios.get("/user/get_email_of_reporter", {
          params: { id: userId },
        });
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Failed to fetch email:", error);
      }
    };

    fetchEmail();
  }, []);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
    setFeedbackError("");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setMessageError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!feedback) {
      setFeedbackError("Please select an issue or report.");
      isValid = false;
    }
    const wordCount = message.trim().split(/\s+/).length;
    if (!message || wordCount < 5) {
      setMessageError("Please enter at least 5 words.");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed.");
      return;
    }

    const reportData = {
      post_id: postId,
      PostType: postType,
      Reporter_Email: email,
      ReportJustification: message,
      report_tile: feedback,
    };

    try {
      const response = await axios.post("/user/submit_report", reportData);
      console.log("Report submitted successfully:", response.data);
      navigate("/user/Homepage");
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="bg-grey py-3 py-md-5">
        <div className="container-fluid">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
              <h1 className="mb-4 display-5 text-center text-dark">
                <h1
                  className="mb-3 title mb-xl-4 text-uppercase text-center my-5"
                  style={{ fontSize: "38px" }}
                >
                  Feedback Form
                </h1>
              </h1>
              <hr className="w-50 mx-auto mb-5 mb-xl-9 border-light-subtle" />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-lg-center">
            <div className="col-12 col-lg-9">
              <div
                style={{ border: "2px dotted black", borderRadius: 30 }}
                className="bg-light   shadow-sm overflow-hidden"
              >
                <form onSubmit={handleSubmit}>
                  <div className="row gy-4 gy-xl-5 p-4 p-xl-5">
                    <div className="dropdown col-12">
                      <label
                        style={{ fontSize: 26 }}
                        htmlFor="feedback"
                        className="form-label"
                      >
                        Feedback <span className="text-danger">*</span>
                      </label>
                      <br />
                      <select
                        className="form-select"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        aria-label="Default select example"
                      >
                        <option value="" disabled>
                          Select Issue / Report
                        </option>
                        <option value="Hate Speech">Hate Speech</option>
                        <option value="Nudity or Sexual Content">
                          Nudity or Sexual Content
                        </option>
                        <option value="Unauthorized Sale">
                          Unauthorized Sale
                        </option>
                        <option value="Harassment">Harassment</option>
                        <option value="Fraud or Scam">Fraud or Scam</option>
                        <option value="Violence">Violence</option>
                        <option value="Something Else">Something Else</option>
                      </select>
                      {feedbackError && (
                        <div className="text-danger">{feedbackError}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label
                        htmlFor="message"
                        className="form-label"
                        style={{ fontSize: 26 }}
                      >
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        value={message}
                        style={{ fontSize: 20 }}
                        onChange={handleMessageChange}
                        placeholder="Enter briefly about the issue or Feedback"
                        id="message"
                        name="message"
                        rows="7"
                        required
                      ></textarea>
                      {messageError && (
                        <div className="text-danger">{messageError}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-dark bg-dark"
                          style={{ fontSize: 20 }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

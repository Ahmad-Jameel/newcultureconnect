import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom"; 

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/admin/fetch_all_reports");
        setReports(
          response.data.map((report) => ({
            ...report,
            edited: false,
            buttonText: report.reportstatus ? "Updated" : "Done", // Set initial button text based on report status
            showActions: false,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch reports: ", error);
      }
    };

    fetchReports();
  }, []);

  const handleInputChange = (event, reportId) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? { ...report, queryanswer: event.target.value, edited: true }
          : report
      )
    );
  };

  const handleDoneClick = async (reportId) => {
    const reportToUpdate = reports.find((report) => report.id === reportId);
    if (reportToUpdate && reportToUpdate.queryanswer.split(" ").filter(Boolean).length < 5) {
      setErrorMessage("Please enter at least 5 words to update the report.");
      return; // Exit the function early if the criteria aren't met
    }
    
    // Update the button to "Updated" and clear any error message
    const reportRows = reports.map((report, index) => (
      <tr key={report.id}>
        {/* Existing table cells remain the same */}
        <td>
          <input
            type="text"
            className="form-control"
            value={report.queryanswer || ""}
            onChange={(e) => handleInputChange(e, report.id)}
            readOnly={report.buttonText === "Updated" || report.reportstatus} // Make read-only based on status
          />
        </td>
        <td>
          <div style={{ position: "relative" }}>
            <button
              className="btn"
              onClick={() => toggleActionVisibility(report.id)}
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            {report.showActions && (
              <div style={{ position: "absolute", zIndex: 1, right: 0 }}>
                {report.reportstatus ? (
                  // If reportstatus is true, only show the "Updated" button
                  <button
                    className="btn btn-success p-1"
                    style={{ fontSize: 16 }}
                    disabled
                  >
                    Updated
                  </button>
                ) : (
                  // If reportstatus is false, show "Done" and "View" buttons
                  <>
                    <button
                      className={`btn ${report.edited ? "btn-danger" : "btn-outline-secondary"} p-1`}
                      style={{ fontSize: 16 }}
                      onClick={() => handleDoneClick(report.id)}
                    >
                      {report.buttonText}
                    </button>
                    <button
                      className="btn btn-primary p-1"
                      style={{ fontSize: 16 }}
                      onClick={() => handleViewClick(report.id)}
                    >
                      View
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>
    ));


    
    setErrorMessage(null);
  
    // Prepare the data to be sent to the backend
    const dataToSend = {
      id: reportToUpdate.id,
      createdAt: reportToUpdate.createdAt,
      Reported_Post_ID: reportToUpdate.Reported_Post_ID,
      postType: reportToUpdate.postType,
      Reporttitle: reportToUpdate.Reporttitle,
      reportjustification: reportToUpdate.reportjustification,
      Reporter_email: reportToUpdate.Reporter_email,
      queryanswer: reportToUpdate.queryanswer
    };

    console.log("data sending to backend is --------", dataToSend)
  
    // Send the data to the backend
    try {
      await axios.post("/admin/report_query_update", dataToSend);
      console.log("Report updated successfully", dataToSend);
    } catch (error) {
      console.error("Failed to update report: ", error);
      // Optionally, handle the error more gracefully in your UI
    }
  };
  

  const toggleActionVisibility = (reportId) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? { ...report, showActions: !report.showActions }
          : report
      )
    );
  };

  const reportRows = reports.map((report, index) => (
    <tr key={report.id}>
      <th scope="row">{index + 1}</th>
      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
      <td>{report.Reported_Post_ID}</td>
      <td>{report.postType}</td>
      <td>{report.Reporttitle}</td>
      <td>{report.reportjustification}</td>
      <td>{report.Reporter_email}</td>
      <td>
        <input
          type="text"
          className="form-control"
          value={report.queryanswer || ""}
          onChange={(e) => handleInputChange(e, report.id)}
          readOnly={report.buttonText === "Updated"}
        />
      </td>
      <td>
        <div style={{ position: "relative" }}>
          <button
            className="btn"
            onClick={() => toggleActionVisibility(report.id)}
          >
            <i className="fas fa-ellipsis-v"></i>{" "}
            {/* Assuming you're using FontAwesome for icons */}
          </button>
          {report.showActions && (
            <div style={{ position: "absolute", zIndex: 1, right: 0 }}>
              <button
                className={`btn ${
                  report.edited ? "btn-danger" : "btn-outline-secondary"
                } p-1`}
                style={{ fontSize: 16 }}
                onClick={() => handleDoneClick(report.id)}
                disabled={report.buttonText === "Updated"}
              >
                {report.buttonText}
              </button>
              {/* Add more action buttons here as needed */}
            </div>
          )}
        </div>
      </td>
    </tr>
  ));

  const handleViewClick = (reportId) => {
    const report = reports.find(report => report.id === reportId);
    console.log("Viewing report with ID:", reportId);
    
    if (report) {
      if (report.postType === 'blog') {
        navigate('/adminViewBlogPost', { state: { postType: report.postType, Reported_Post_ID: report.Reported_Post_ID } });
      } else {
        navigate('/adminViewSocialPost', { state: { postType: report.postType, Reported_Post_ID: report.Reported_Post_ID } });
      }
    }
  };

  console.log("error msg", errorMessage);
  return (
    <div>
      {errorMessage && (
      <div className="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    )}

      <div className="container">
        <div className="row">
          <div className="col-md-12">
          <h1
            className="mb-3 title mb-xl-4 text-uppercase text-center my-2"
            style={{ fontSize: "38px" }}
          >
            Admin Panel
          </h1>
            <hr />
            <br />
            <h2 className="my-3" style={{ fontSize: 38 }}>
              Feedbacks
            </h2>
            <h5 className="my-2" style={{ fontSize: 20 }}>
              Collected Feedbacks
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped table-hover">
              <thead >
                <tr >
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Sr#</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Date</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Reported_Post_ID</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Post Type</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Issue</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Report Reason</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Email</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Query Answer</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">Done</th>
                  <th style={{backgroundColor:"black", color:"white"}} scope="col">View</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>{report.Reported_Post_ID}</td>
                    <td>{report.postType}</td>
                    <td>{report.Reporttitle}</td>
                    <td>{report.reportjustification}</td>
                    <td>{report.Reporter_email}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={report.queryanswer || ""}
                        onChange={(e) => handleInputChange(e, report.id)}
                        readOnly={report.buttonText === "Updated"}
                      />
                    </td>
                    <td>
                    <button
                            className={`btn ${report.edited ? "btn-danger" : "btn-success"} p-1`}
                            style={{ fontSize: 16, margin: "5px" }} 
                            onClick={() => handleDoneClick(report.id)}
                            disabled={report.buttonText === "Updated"}
                          >
                            {report.buttonText}
                          </button>
                    </td>
                    <td>
                    <button
                            className="btn btn-primary p-1"
                            style={{ fontSize: 16, margin: "5px" }} 
                            onClick={() => handleViewClick(report.id)}
                          >
                            View
                          </button>
                    </td>
                    {/* <td>
                      <div style={{ position: "relative" }}>
                        <button
                          className="btn"
                          onClick={() => toggleActionVisibility(report.id)}
                        >
                          <i className="fas fa-ellipsis-v"></i>{" "}
                         
                        </button>
                        {report.showActions && (
                          <div style={{ position: 'absolute', zIndex: 1, right: 0, backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0,0,0,0.5)', borderRadius: '5px', padding: '5px' }}>
                          <button
                            className={`btn ${report.edited ? "btn-danger" : "btn-outline-secondary"} p-1`}
                            style={{ fontSize: 16, margin: "5px" }} 
                            onClick={() => handleDoneClick(report.id)}
                            disabled={report.buttonText === "Updated"}
                          >
                            {report.buttonText}
                          </button>
                          <button
                            className="btn btn-primary p-1"
                            style={{ fontSize: 16, margin: "5px" }} 
                            onClick={() => handleViewClick(report.id)}
                          >
                            View
                          </button>
                        </div>
                        )}
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

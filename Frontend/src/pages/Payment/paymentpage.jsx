import React, { useState, useEffect } from "react";
import axios from "../../axios";

export default function CheckPayment() {
  const [reports, setReports] = useState([]); // Initialize reports to an empty array
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: '20%', left: '25%' });

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get("/admin/getAllPaymentData");
        // Transform data to match your frontend structure
        const transformedData = response.data.map(item => ({
          id: item.id,
          userID: item.UserID || "N/A", 
          chatboxID: item.ChatID || "N/A", 
          email: item.Email || "user@example.com", 
          amount: `$${item.Amount}`,
          lastDigitsOfAccount: item.Last_four_digit_of_account.toString(),
          paymentMethod: item.Payment_Method,
          date: item.Date,
          Time: item.Time,
          paymentPic: `http://localhost:5000/${item.Payment_Pic}`, 
          confirm_payment: item.isVerified ? "Confirmed" : "Confirm"
        }));
        setReports(transformedData);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    };

    fetchPaymentData();
  }, []);

  const initialReports = [
    {
      id: 1,
      userID: "User123",
      chatboxID: "Chat123",
      email: "user@example.com",
      amount: "$100",
      lastDigitsOfAccount: "6789",
      paymentMethod: "Credit Card",
      date: new Date().toISOString(),
      Time: "Processed",
      paymentPic: "https://via.placeholder.com/150",
      confirm_payment: "Confirm",
    },
  ];


  
  const openModal = (event, imageURL) => {
    const buttonPosition = event.target.getBoundingClientRect(); 
    const topPosition = buttonPosition.top + window.scrollY + 20;
    const leftPosition = buttonPosition.left + window.scrollX;

    setCurrentImage(imageURL);
    setShowModal(true);
    setModalPosition({ top: `${topPosition}px`, left: `${leftPosition}px` });
  };

  
  const closeModal = () => {
    setShowModal(false);
    setCurrentImage('');
  };

  const Modal = ({ show, onClose, imgSrc, position }) => {
    if (!show) {
      return null;
    }

    
  
    return (
      <div style={{
        position: 'fixed', 
        top: position.top, 
        left: position.left, 
        backgroundColor: 'white', 
        padding: 20, 
        zIndex: 100,
        border: '1px solid #ccc',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
        width: '340px', 
        height: '340px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src={imgSrc} alt="Payment Proof" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
        <br/>
        <button onClick={onClose} style={{marginTop: '10px', position: 'absolute', top: '10px', right: '10px'}}>Close</button>
      </div>
    );
  };


  const confirmPayment = async (reportId) => {
    try {
      // Assuming you might need to send the report ID or some other data for confirmation
      const response = await axios.post(`/admin/paymentConfirmation?reportId=${reportId}`);
      // Handle response, maybe refresh data or show a confirmation message
      console.log('Payment confirmed for:', reportId);
      // Optionally, refresh your reports list here to reflect the confirmation
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
        <h1
            className="  title mb-xl-4 text-uppercase text-center my-3 mb-5"
            style={{ fontSize: "38px" }}
          >
            Payment
          </h1>
          <table className="table mt-3 table-striped">
            <thead>
              <tr>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">#</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">UserID</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">ChatboxID</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Email</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Amount</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">LastDigitsOfAccount</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">PaymentMethod</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Date</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Time</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Payment Pic</th>
                <th style={{backgroundColor:"black", color:"white"}} scope="col">Confirm Payment</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{report.userID}</td>
                  <td>{report.chatboxID}</td>
                  <td>{report.email}</td>
                  <td>{report.amount}</td>
                  <td>{report.lastDigitsOfAccount}</td>
                  <td>{report.paymentMethod}</td>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                  <td>{report.Time}</td>
                  <td>
                    <button className="btn btn-link" onClick={(e) => openModal(e, report.paymentPic)}>View</button>
                  </td>
                  <td>
        <button className="btn btn-success" onClick={() => confirmPayment(report.id)}>
          Confirm Payment
        </button>
      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModal}
            onClose={closeModal} imgSrc={currentImage} position={modalPosition} />
            </div>
          );
        }
        

import React, { useState, useEffect } from "react";
import pic1 from "../../assets/grey.jpeg";
import axios from '../../axios'; // Adjust the import path based on your project structure


export default function Adspage() {
    const [profilePicURL, setProfilePicURL] = useState(pic1);
    const [profilePic, setProfilePic] = useState(pic1);

  const [fixedValue, setFixedValue] = useState("5000");
  // Assume you've defined date, time, dateError, and timeError state along with handleChange
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
const [formError, setFormError] = useState("");
const [isFormValid, setIsFormValid] = useState(false);



  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const [digitValue, setDigitValue] = useState("");
  const [digitError, setDigitError] = useState("");
  const [fileError, setFileError] = useState("");

  const displaySelectedImage = (event) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];

        if (file.type.startsWith("image/")) {
            const fileURL = URL.createObjectURL(file);
            setProfilePicURL(fileURL); // For displaying the image
            setProfilePic(file); // Keep the File object for uploading
            setFileError("");
        } else {
            setFileError("Please select an image file (e.g., .jpg, .png, .gif)");
        }
    }
};

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      default:
        break;
    }
  };

  const handleDigitChange = (event) => {
    const value = event.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setDigitValue(value);
      setDigitError("");
    } else {
      setDigitError(
        "Input must be a 4-digit number and should be of the account from which you have transfered money"
      );
    }
  };

  useEffect(() => {
    validateForm();
  }, [date, time, digitValue, digitError, selectedPaymentMethod, profilePic, fileError]);
  


  const validateForm = () => {
    const isDateSelected = date !== "";
    const isTimeSelected = time !== "";
    const isDigitValid = digitValue.length === 4 && digitError === "";
    const isPaymentMethodSelected = selectedPaymentMethod !== "";
    const isImageSelected = profilePic !== pic1 && fileError === "";
  
    setIsFormValid(isDateSelected && isTimeSelected && isDigitValid && isPaymentMethodSelected && isImageSelected);
  };



  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!isFormValid) {
        alert('Please ensure all fields are correctly filled out.');
        return;
    }

    const formData = new FormData();
    formData.append('Amount', fixedValue);
    formData.append('Last_four_digit_of_account', digitValue);
    formData.append('Payment_Pic', profilePic); // Append the File object
    formData.append('Payment_Method', selectedPaymentMethod);
    formData.append('Date', date);
    formData.append('Time', time);

    try {
        const response = await axios.post('/user/payment_by_user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        alert('Payment successfully recorded');
    } catch (error) {
        console.error('Error submitting payment:', error);
        alert('Error submitting payment');
    }
};



  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center d-flex flex-column justify-content-center">
            <h1 className="my-5" style={{ fontSize: 38 }}>
              Payment
            </h1>
            <hr />
            {/* Amount Transfer */}
            <label className="form-label text-center mt-5" htmlFor="fixedValue">
              Amount Transfer<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control mb-5"
              id="fixedValue"
              value="5000"
              readOnly
            />

            {/* Last four digits of your account number */}
            <label className="form-label text-center mt-5" htmlFor="digitValue">
              Last four digits of your account number<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control mb-5"
              id="digitValue"
              value={digitValue}
              onChange={handleDigitChange}
              maxLength="4"
            />
            {digitError && <div className="text-danger">{digitError}</div>}

            {/* Date and Time */}
            <div className="-mx-3 flex flex-wrap">
              {/* Date input */}
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    value={date}
                    onChange={handleChange}
                  />
                  {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
                </div>
              </div>
              {/* Time input */}
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="time" className="mb-3 block text-base font-medium text-[#07074D]">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    value={time}
                    onChange={handleChange}
                  />
                  {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
                </div>
              </div>
            </div>

            {/* Add Payment Method */}
            <label className="form-label text-center mt-5" htmlFor="Adds">
              Add Payment Method<span className="text-danger">*</span>
            </label>
            <select
              className="form-select mb-5"
              aria-label="Default select example"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="HBL">HBL</option>
              <option value="Easypaisa">Easypaisa</option>
              <option value="Jazzcash">Jazzcash</option>
              <option value="Sadapay">Sadapay</option>
              <option value="Mezan Bank">Mezan Bank</option>
              <option value="Others">Others</option>
            </select>
            {formError && <div className="text-center text-danger mt-2">{formError}</div>}

                        {/* Confirm Payment button */}
                        {/* Confirm Payment and Cancel buttons */}
<div className="d-flex justify-content-center">
  <button
    className="btn btn-danger mb-5 btn-lg mx-2"
    onClick={(e) => {
      e.preventDefault();
      // Here, implement what should happen when Cancel is clicked
      // For example, clear the form, navigate to a different page, etc.
      console.log("Cancel action triggered");
    }}
  >
    <b> Cancel </b>
  </button>
  <button
  className={`btn mb-5 btn-lg mx-2 ${isFormValid ? 'btn-primary' : 'btn-light'}`}
  onClick={handleSubmit}
>
  <b> Confirm Payment </b>
</button>
</div>

          </div>
          <div className="col-md-6 text-center">
            <h4 className="mb-4 mt-5 text-center text-dark" style={{ fontSize: "38px" }}>
              Upload Picture
            </h4>
            <div className="mb-4 d-flex justify-content-center">
            <img
  id="selectedImage1"
  src={profilePicURL}
  alt="Uploaded"
  style={{ width: "400px", height: "400px" }}
/>
            </div>
            <div className="d-flex justify-content-center">
              <div className="btn btn-primary btn-rounded">
                <label className="form-label text-white m-1" htmlFor="customFile1">
                  Choose file
                </label>
                <input
                  type="file"
                  className="form-control d-none"
                  id="customFile1"
                  accept="image/*"
                  onChange={displaySelectedImage}
                />
              </div>
            </div>
            {fileError && <div className="text-danger text-center mt-2">{fileError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate } from "react-router-dom";

export default function AddNotification() {
    
    // States for input fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postCode, setPostCode] = useState('');

    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [addressError, setAddressError] = useState('');

    const navigate = useNavigate();

    


    // Input change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setTitle(value);
                setTitleError('');
                break;
            case 'phone':
                setDescription(value);
                setDescriptionError('');
                break;
            case 'date':
                setDate(value);
                setDateError('');
                break;
            case 'time':
                setTime(value);
                setTimeError('');
                break;
            case 'area':
                setArea(value);
                setAddressError(''); 
                break;
            case 'city':
                setCity(value);
                setAddressError(''); 
                break;
            case 'state':
                setState(value);
                setAddressError(''); 
                break;
            case 'post-code':
                setPostCode(value);
                setAddressError(''); 
                break;
            default:
                break;
        }
    };

    // Validation functions
    const validateForm = () => {
        let isValid = true;

        if (title.split(' ').length < 3) {
            setTitleError('Title must be at least 3 words.');
            isValid = false;
        }

        if (description.split(' ').length < 10) {
            setDescriptionError('Description must be at least 10 words.');
            isValid = false;
        }

        if (!date) {
            setDateError('Please select a date.');
            isValid = false;
        }

        if (!time) {
            setTimeError('Please select a time.');
            isValid = false;
        }

        if (!area || !city || !state || !postCode) {
            setAddressError('All address fields must be filled.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const payload = {
                Notification_Title: title,
                Notification_Description: description,
                Date: date,
                Time: time,
                City: city,
                Area: area,
                State: state,
                AddressNumber: postCode,
            };
            console.log(payload.data)

            try {
                // Using axios to send data to your backend
                const response = await axios.post('/admin/addNotification', payload);
                
                alert('Form submitted successfully!');
                navigate("/adminfeedback")
                
                // Optionally reset form state here
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error);
                // Handle error here, such as showing an error message to the user
            }
        }
    };




    return (
        <div>
            <div className="flex items-center justify-center p-12">
                <div className="mx-auto w-full max-w-[550px] bg-white">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                                Notification Title
                            </label>
                            <input type="text" name="name" id="name" placeholder="Enter Title"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" 
                                value={title} onChange={handleChange} />
                            {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
                        </div>
    
                        <div className="mb-5">
                            <label htmlFor="phone" className="mb-3 block text-base font-medium text-[#07074D]">
                                Description
                            </label>
                            <input type="text" name="phone" id="phone" placeholder="Enter description of notification"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" 
                                value={description} onChange={handleChange} />
                            {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
                        </div>
    
                        <div className="-mx-3 flex flex-wrap">
                            <div className="w-full px-3 sm:w-1/2">
                                <div className="mb-5">
                                    <label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
                                        Date
                                    </label>
                                    <input type="date" name="date" id="date"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" 
                                        value={date} onChange={handleChange} />
                                    {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
                                </div>
                            </div>
                            <div className="w-full px-3 sm:w-1/2">
                                <div className="mb-5">
                                    <label htmlFor="time" className="mb-3 block text-base font-medium text-[#07074D]">
                                        Time
                                    </label>
                                    <input type="time" name="time" id="time"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" 
                                        value={time} onChange={handleChange} />
                                    {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
                                </div>
                            </div>
                        </div>
    
                        <div className="mb-5 pt-3">
                            <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                                Address Details
                            </label>
                            <div className="-mx-3 flex flex-wrap">
                                <div className="w-full px-3 sm:w-1/2">
                                    <div className="mb-5">
                                        <input type="text" name="area" id="area" placeholder="Enter area"
                                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" 
                                            value={area} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="w-full px-3 sm:w-1/2">
                                    <div className="mb-5">
                                        <input type="text" name="city" id="city" placeholder="Enter city"
                                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            value={city} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="w-full px-3 sm:w-1/2">
                                    <div className="mb-5">
                                        <input type="text" name="state" id="state" placeholder="Enter state"
                                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            value={state} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="w-full px-3 sm:w-1/2">
                                    <div className="mb-5">
                                        <input type="text" name="post-code" id="post-code" placeholder="Address number"
                                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            value={postCode} onChange={handleChange} />
                                    </div>
                                </div>
                                {addressError && <p className="text-red-500 text-xs mt-1 w-full px-3">{addressError}</p>}
                            </div>
                        </div>
    
                        <div>
                            <button type="submit"
                                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
    
                                   
    
}

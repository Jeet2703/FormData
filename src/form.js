import React, { useState } from "react";
import "./form.css";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import logo from "./assets/Bajaj Emerald.png"

const UserForm = () => {
  const [formData, setFormData] = useState({
    jointMembers: [],
    shareCertificateNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    wingName: "",
    flatNo: "",
    flatSize: "",
    flatArea: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    parentOrSpouseName: "",
    familyMembers: [],
    guardianName: "",
    religion: "",
    nationality: "",
    otherCountry: "",
    aadhar: "",
    panCard: "",
    education: "",
    profession: "",
    mobileNumber: "",
    alternateContact: "",
    email: "",
    fourWheelers: [],
    twoWheelers: [],
    photo: null,
    signature: null,
    petDetails: "",
    rented: "",
    residentialAddress: "",
    tenants: [],
    declaration: false,
    date: "",
  });

  const [flatAreaOptions, setFlatAreaOptions] = useState([]);
  const [isFlatAreaText, setIsFlatAreaText] = useState(false);

  const [preview, setPreview] = useState(false); // This controls the visibility of the preview modal

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    console.log("birth Date: ", birthDate);
    console.log("today:", today);
    let age = today.getFullYear() - birthDate.getFullYear();
    console.log("age:", age);
    const monthDifference = today.getMonth() - birthDate.getMonth();
    console.log("month diff: ", monthDifference);
    const dayDifference = today.getDate() - birthDate.getDate();
    console.log("day diff: ", dayDifference);
  
    // Adjust age if the current month/day is before the birth month/day
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
  
    return age;
  };

  const [showGuardianField, setShowGuardianField] = useState(false);

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'flatSize') {
      if (value === '3 bhk') {
        setFlatAreaOptions([
          '901 sqft',
          '720 sqft',
          '897 sqft',
          '910 sqft',
          '899 sqft',
          '1011 sqft',
        ]);
        setIsFlatAreaText(false);
      } else if (value === '2 bhk') {
        setFlatAreaOptions(['776 sqft']);
        setIsFlatAreaText(false);
      } else if (value === '1 bhk') {
        setFlatAreaOptions([]);
        setIsFlatAreaText(true);
      }
    }

    if (name === "dob") {
      const age = calculateAge(value);
      setShowGuardianField(age < 18);
    }
  };

  // Function to handle file input changes (for photo and signature)
  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: '', dob: '', relation: '' }],
    });
  };

  const deleteFamilyMember = (index) => {
    setFormData((prev) => ({
      ...formData,
      familyMembers: formData.familyMembers.filter((_, i) => i !== index),
    }));
  };

  const handleFamilyMemberChange = (e, index, field) => {
    const updatedFamilyMembers = [...formData.familyMembers];
    updatedFamilyMembers[index][field] = e.target.value;
    setFormData({ ...formData, familyMembers: updatedFamilyMembers });
  };

  const addJointMember = () => {
    setFormData({
      ...formData,
      jointMembers: [
        ...formData.jointMembers,
        {
          firstName: '',
          middleName: '',
          lastName: '',
          dob: '',
          gender: '',
          maritalStatus: '',
          mobileNumber: '',
          email: '',
        },
      ],
    });
  };

  // Delete Joint Member
  const deleteJointMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      jointMembers: formData.jointMembers.filter((_, i) => i !== index),
    }));
  };

  // Handle Joint Member Change
  const handleJointMemberChange = (e, index, field) => {
    const updatedJointMembers = [...formData.jointMembers];
    updatedJointMembers[index][field] = e.target.value;
    setFormData({ ...formData, jointMembers: updatedJointMembers });
  };

  const addFourWheeler = () => {
    setFormData((prevData) => ({
      ...prevData,
      fourWheelers: [
        ...(prevData.fourWheelers || []),
        { registration: "", parkingSlot: "", make: "", model: "", type: "" },
      ],
    }));
  };

  const deleteFourWheeler = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      fourWheelers: prevData.fourWheelers.filter((_, i) => i !== index),
    }));
  };
  

  const handleFourWheelerChange = (e, index, field) => {
    const updatedFourWheelers = [...formData.fourWheelers];
    updatedFourWheelers[index][field] = e.target.value;
    setFormData({ ...formData, fourWheelers: updatedFourWheelers });
  };

  const addTwoWheeler = () => {
    setFormData((prevData) => ({
      ...prevData,
      twoWheelers: [
        ...(prevData.twoWheelers || []),
        { registration: "", parkingSlot: "", make: "", model: "", type: "" },
      ],
    }));
  };

  const deleteTwoWheeler = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      twoWheelers: prevData.twoWheelers.filter((_, i) => i !== index),
    }));
  };
  

  const handleTwoWheelerChange = (e, index, field) => {
    const updatedTwoWheelers = [...formData.twoWheelers];
    updatedTwoWheelers[index][field] = e.target.value;
    setFormData({ ...formData, twoWheelers: updatedTwoWheelers });
  };

  const handleTenantChange = (e, index, field) => {
    const { name, value } = e.target;
    const tenants = [...formData.tenants];
    tenants[index][name] = value;
    setFormData({ ...formData, tenants });
  };

  const addTenant = () => {
    setFormData({
      ...formData,
      tenants: [
        ...formData.tenants,
        { name: "", dob: "", gender: "", mobileNo: "", agreementDate: "" },
      ],
    });
  };

  const deleteTenant = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      tenants: prevData.tenants.filter((_, i) => i !== index),
    }));
  };
  

  const handleCheckboxChange = () => {
    setFormData({ ...formData, declaration: !formData.declaration });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Validation Error", "File size exceeds 5MB");
      return;
    }
    setFormData({ ...formData, [name]: file });
  };

  // Function to handle the preview button click
  const handlePreview = () => {
    const {
      email,
      jointMembers,
      shareCertificateNo,
      firstName,
      middleName,
      lastName,
      wingName,
      flatNo,
      flatSize,
      flatArea,
      dob,
      gender,
      maritalStatus,
      parentOrSpouseName,
      familyMembers,
      guardianName,
      religion,
      nationality,
      otherCountry,
      aadhar,
      panCard,
      education,
      profession,
      mobileNumber,
      alternateContact,
      tenants,
      rented,
      residentialAddress,
      declaration,
      date,
    } = formData;

    // Mandatory field check
    const validateField = () => {
      // Personal Information
      // if (!jointMembers || jointMembers.length === 0) return 'Please add at least one Family Member.';
      if(jointMembers && jointMembers.length === 0) {
        for (let i = 0; i < jointMembers.length; i++) {
          if(!jointMembers[i].firstName) return `First name is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].middleName) return `Middle name is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].lastName) return `Last name is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].dob) return `Date of Birth is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].gender) return `Gender is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].maritalStatus) return `Marital status is missing for Joint Member ${i + 1}.`;
          else if (!jointMembers[i].mobileNumber) return `Mobile number is missing for Joint Member ${i + 1}.`;
          else if (!/^\d{10}$/.test(jointMembers[i].mobileNumber)) return 'Mobile number must be exactly 10 digits.';
          else if (!jointMembers[i].email) return `Email is missing for Joint Member ${i + 1}.`;
          else if (!/^\S+@\S+\.\S+$/.test(jointMembers[i].email)) return 'Invalid email format.';
        }
      }
      if (!shareCertificateNo) return 'Share Certificate Number is mandatory.';
      else if (!firstName) return 'First Name is mandatory.';
      else if (!middleName) return 'Middle Name is mandatory.';
      else if (!lastName) return 'Last Name is mandatory.';
      else if (!dob) return 'Date of Birth is mandatory.';
      else if (new Date(dob) > new Date()) return 'Date of Birth cannot be in the future.';
      else if (!gender) return 'Gender is mandatory.';
      else if (!maritalStatus) return 'Marital Status is mandatory.';
      else if (!parentOrSpouseName) return 'Parent or Spouse Name is mandatory.';
      else if (showGuardianField && !guardianName) return 'Guardian Name is mandatory.';
      else if (!religion) return 'Religion is mandatory.';
      else if (!nationality) return 'Nationality is mandatory.';
      else if (nationality === 'Other' && !otherCountry) return 'Please specify the country if Nationality is "Other".';
    
      // Identification Information
      else if (!aadhar) return 'Aadhar number is mandatory.';
      else if (!/^\d{12}$/.test(aadhar)) return 'Aadhar number must be exactly 12 digits.';
      else if (!panCard) return 'PAN Card number is mandatory.';
      else if (panCard.length > 10) return 'PAN Card number cannot exceed 10 characters.';
      else if(panCard.length < 10) return 'PAN Card number cannot be less than 10 characters.';
      else if (!education) return 'Education Details is mandatory.';
      else if (!profession) return 'Profession is mandatory.';
    
      // Contact Information
      else if (!mobileNumber) return 'Mobile Number is mandatory.';
      else if (!/^\d{10}$/.test(mobileNumber)) return 'Mobile number must be exactly 10 digits.';
      else if (!alternateContact) return 'Alternate Contact Number is mandatory.';
      else if (!/^\d{10}$/.test(alternateContact)) return 'Alternate contact number must be exactly 10 digits.';
      else if (!email) return 'Email is mandatory.';
      else if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email format.';
    
      // Residential Information
      else if (rented === "yes" && !residentialAddress) return 'Residential Address is mandatory.';
      else if (!wingName) return 'Wing Name is mandatory.';
      else if (!flatNo) return 'Flat Number is mandatory.';
      else if (!flatArea) return 'Flat Area is mandatory.';
      else if (!flatSize) return 'Flat Size is mandatory.';
    
      // Membership Detail
    
      // Family Members

      else if (!familyMembers || familyMembers.length === 0) return 'Please add at least one Family Member.';
      else if(familyMembers || familyMembers.length === 0) {
        for (let i = 0; i < familyMembers.length; i++) {
          if(!familyMembers[i].name) return `Name is missing for Family Member ${i + 1}.`;
          else if (!familyMembers[i].dob) return `Date of Birth is missing for Family Member ${i + 1}.`;
          else if (new Date(familyMembers[i].dob) > new Date()) return `Date of Birth cannot be in future for Family Member ${i + 1}.`;
          else if (!familyMembers[i].relation) return `Relation is missing for Family Member ${i + 1}.`;
        }
      }

    
      // // Vehicles
      // else if (!fourWheelers || fourWheelers.length === 0) return 'Four Wheeler details are mandatory.';
      // else if (!twoWheelers || twoWheelers.length === 0) return 'Two Wheeler details are mandatory.';

      else if (rented === "yes" && !residentialAddress) return 'Residential Address is mandatory.';
    
      // // Tenants
      else if (rented === "yes" && (!tenants || tenants.length === 0)) return 'Tenant details are mandatory for rented properties.';
    
      else if (!date) return 'Date is mandatory.';
      else if (new Date(date) > new Date()) return 'Date cannot be in the future.';

      // Pets
      // else if (petDetails && petDetails.length === 0) return 'Pet Details are mandatory if you have pets.';
      else if (rented === "yes" && tenants.length > 0) {
        for (let i = 0; i < tenants.length; i++) {
          if(!tenants[i].name) return `Name for Tenant ${i + 1} is mandatory.`;
          else if (!tenants[i].dob) return `Date of birth for Tenant ${i + 1} is mandatory.`;
          else if (new Date(tenants[i].dob) > new Date()) return `Date of Birth cannot be in future for Tenant ${i + 1}.`;
          else if (!tenants[i].gender) return `Gender for Tenant ${i + 1} is mandatory.`;
          else if (!tenants[i].mobileNo) return `Mobile number for Tenant ${i + 1} is mandatory.`;
          else if (!tenants[i].agreementDate) return `Agreement Date for Tenant ${i + 1} is mandatory.`;
        }
      }
      // Declaration
      else if (!declaration) return 'You must accept the declaration.';
    
      
    
      return null; // No errors found
    };
    
    // Usage in the Preview Button Handler
    const errorMessage = validateField();
    if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage,
      });
    } else {
      setPreview(true);
    }
 // Show preview modal when clicked
  };

  // Function to close the preview modal
  const closeModal = () => {
    setPreview(false); // Hide preview modal when clicked
  };

  // Function to handle form submission

  // Function to handle PDF download
  const handleDownload = () => {

    const options = {
      margin: 20,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
          scale: 2,
          logging: true,
          letterRendering: true,
          useCORS: true
      },
      jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          compress: true,
          pageSize: 'A4',
          // Ensure content breaks correctly between pages
          autoPaging: true
      }
  };

    const element = document.querySelector(".modal-content");
    const downloadButton = document.querySelector(".download-btn-container");

    // Temporarily hide the download button (keep layout consistent)
    if (downloadButton) {
      downloadButton.style.visibility = "hidden"; // Use visibility instead of display
    }

    // Generate the PDF
    html2pdf()
      .from(element)
      .set(options)
      .save(`${formData.firstName}_${formData.middleName}_${formData.lastName}_form.pdf`)
      .then(() => {
        // Restore the visibility of the download button after the PDF is downloaded
        if (downloadButton) {
          downloadButton.style.visibility = "visible"; // Restore visibility
        }
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Restore visibility of the download button in case of an error
        if (downloadButton) {
          downloadButton.style.visibility = "visible"; // Restore visibility
        }
      });
  };

  const handleDownload1 = () => {
    const options = {
        margin: 20,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            logging: true,
            letterRendering: true,
            useCORS: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            putOnlyUsedFonts: true,
            compress: true,
            pageSize: 'A4',
            autoPaging: true
        }
    };
    
    const element = document.querySelector(".modal-content");
  
    const downloadButton = document.querySelector(".download-btn-container");

    // Temporarily hide the download button (keep layout consistent)
    if (downloadButton) {
      downloadButton.style.visibility = "hidden"; // Use visibility instead of display
    }

    console.log("Found .modal-content:", element);

    // Generate the PDF as a base64 string
    return new Promise((resolve, reject) => {
        html2pdf()
            .from(element)
            .set(options)
            .output('datauristring') // This generates a base64 string instead of saving the PDF
            .then((pdfBase64) => {
                resolve(pdfBase64); // Return the base64 string
                if (downloadButton) {
                  downloadButton.style.visibility = "visible"; // Restore visibility
                }
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
                reject(error); // Reject if there's an error
                if (downloadButton) {
                  downloadButton.style.visibility = "visible"; // Restore visibility
                }
            });
    });
};

const handleSubmit = async (event) => {
  event.preventDefault();

  // Prepare form data for submission
  const formDataToSubmit = new FormData();
  Object.keys(formData).forEach((key) => {
    if (
      key === "familyMembers" ||
      key === "fourWheelers" ||
      key === "twoWheelers" ||
      key === "tenants"
    ) {
      formDataToSubmit.append(key, JSON.stringify(formData[key]));
    } else {
      formDataToSubmit.append(key, formData[key]);
    }
  });

  try {
    // Call the submit-form API
    const formResponse = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/submit-form`, 
      formDataToSubmit,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (formResponse.status === 200) {
      Swal.fire("Success", "Form submitted successfully!", "success");

      // Generate the PDF as base64 string using handleDownload
      const pdfData = await handleDownload1();
      console.log("Generated PDF Data (Base64):", pdfData); // Log the PDF data

      const email1 = formData.email; // Use the user's email for "from" in the email
      const fileName = `${formData.firstName}_${formData.middleName}_${formData.lastName}_form.pdf`;
      const subj = `${formData.flatNo}-${formData.wingName}`;

      // Call the send-email API
      const emailResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/send-email`, 
        {
          email1,
          pdfData,
          fileName,
          subj,
        }
      );

      if (emailResponse.data.success) {
        Swal.fire("Success", "Email sent successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to send email.", "error");
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Show SweetAlert2 for "email already used" error
      Swal.fire("Error", error.response.data.message || "Email already used", "error");
    } else {
      console.error("Error in handleSubmit:", error);
      Swal.fire("Error", "Error submitting the form or sending email.", "error");
    }
  }
};


  return (
    <div className="form-container">
      <div className="form-content">
      <div className="text-center mb-3">
    <img 
      src={logo}
      alt="Society Logo" 
      className="img-fluid" 
      style={{ maxWidth: "100%", height: "auto" }}
    />
  </div>
        <h2 className="form-title">Society Membership Form</h2>
        <form>
          {/* Membership Type */}
          <div className="form-group">
            <label>Membership Type<span className="required-asterisk">*</span></label>
            <div className="form-group">
  
        {formData.jointMembers?.map((member, index) => (
          <div key={index} className="joint-member">
            <h4 style={{ fontWeight: "normal", color: "#555" }}>
              Joint Member {index + 1}
            </h4>
            <input
              type="text"
              name={`firstName${index}`}
              placeholder="First Name"
              value={member.firstName}
              onChange={(e) => handleJointMemberChange(e, index, "firstName")}
            />
            <input
              type="text"
              name={`middleName${index}`}
              placeholder="Middle Name"
              value={member.middleName}
              onChange={(e) => handleJointMemberChange(e, index, "middleName")}
            />
            <input
              type="text"
              name={`lastName${index}`}
              placeholder="Last Name"
              value={member.lastName}
              onChange={(e) => handleJointMemberChange(e, index, "lastName")}
            />
            <input
              type="date"
              name={`dob${index}`}
              value={member.dob}
              onChange={(e) => handleJointMemberChange(e, index, "dob")}
            />
            <select
              name={`gender${index}`}
              value={member.gender}
              onChange={(e) => handleJointMemberChange(e, index, "gender")}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="thirdGender">Third Gender</option>
            </select>
            <select
              name={`maritalStatus${index}`}
              value={member.maritalStatus}
              onChange={(e) =>
                handleJointMemberChange(e, index, "maritalStatus")
              }
            >
              <option value="">Select Marital Status</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
              <option value="others">Others</option>
            </select>
            <input
              type="text"
              name={`mobileNumber${index}`}
              placeholder="Mobile Number"
              value={member.mobileNumber}
              onChange={(e) => handleJointMemberChange(e, index, "mobileNumber")}
            />
            <input
              type="text"
              name={`email${index}`}
              placeholder="Email ID"
              value={member.email}
              onChange={(e) => handleJointMemberChange(e, index, "email")}
            />
            <button
              className="delete-btn"
              onClick={() => deleteJointMember(index)}
            >
              Delete
            </button>
          </div>
        ))}
        <button type="button" onClick={addJointMember}>
          + Add Joint Member
        </button>
      </div>
          </div>

          {/* Share Certificate No */}
          <div className="form-group">
            <label>Share Certificate No.<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="shareCertificateNo"
              value={formData.shareCertificateNo}
              onChange={handleChange}
              
            />
          </div>

          {/* Name Fields */}
          <div className="form-group">
            <label>First Name<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              
            />
          </div>
          <div className="form-group">
            <label>Middle Name<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              
            />
          </div>

          {/* Flat Details */}
          <div className="form-group">
            <label>Flat Details</label>
          </div>

          {/* Wing Name */}
          <div className="form-group">
            <label>Wing Name<span className="required-asterisk">*</span></label>
            <select
              name="wingName"
              value={formData.wingName}
              onChange={handleChange}
              
            >
              <option value="">Select Wing</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Flat No */}
          <div className="form-group">
            <label>Flat No<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleChange}
              
            />
          </div>

          {/* Area of Flat */}
          <div className="form-group">
        <label>
          Flat Size<span className="required-asterisk">*</span>
        </label>
        <select
          name="flatSize"
          value={formData.flatSize}
          onChange={handleChange}
        >
          <option value="">Select Flat Size</option>
          <option value="3 bhk">3 BHK</option>
          <option value="2 bhk">2 BHK</option>
          <option value="1 bhk">1 BHK</option>
        </select>
      </div>

      {/* Flat Area */}
      <div className="form-group">
        <label>
          Flat Area<span className="required-asterisk">*</span>
        </label>
        {isFlatAreaText ? (
          <input
            type="text"
            name="flatArea"
            value={formData.flatArea}
            onChange={handleChange}
            placeholder="Enter flat area (sq ft)"
          />
        ) : (
          <select
            name="flatArea"
            value={formData.flatArea}
            onChange={handleChange}
          >
            <option value="">Select Flat Area</option>
            {flatAreaOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth<span className="required-asterisk">*</span></label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender<span className="required-asterisk">*</span></label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="thirdGender">Third Gender</option>
            </select>
          </div>

          {/* Marital Status */}
          <div className="form-group">
            <label>Marital Status<span className="required-asterisk">*</span></label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              
            >
              <option value="">Select status</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Parent or Spouse Name */}
          <div className="form-group">
            <label>Name of Father/ Mother/ Spouse<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="parentOrSpouseName"
              value={formData.parentOrSpouseName}
              onChange={handleChange}
              
            />
          </div>

          {/* Family Members */}
          <div className="form-group">
            <label>Family Members<span className="required-asterisk">*</span></label>
            {formData.familyMembers?.map((member, index) => (
              <div key={index} className="family-member">
                <h4 style={{ fontWeight: "normal", color: "#555" }}>
                  Member {index + 1}
                </h4>
                <input
                  type="text"
                  name={`memberName${index}`}
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleFamilyMemberChange(e, index, "name")}
                  
                />
                <input
                  type="date"
                  name={`memberDob${index}`}
                  value={member.dob}
                  onChange={(e) => handleFamilyMemberChange(e, index, "dob")}
                  
                />
                <input
                  type="text"
                  name={`memberRelation${index}`}
                  placeholder="Relation"
                  value={member.relation}
                  onChange={(e) =>
                    handleFamilyMemberChange(e, index, "relation")
                  }
                  
                />
                <button className="delete-btn" onClick={() => deleteFamilyMember(index)}>Delete</button>
              </div>
            ))}
            <button type="button" onClick={addFamilyMember}>
              + Add Member
            </button>
          </div>

          {/* Guardian Name (In case of Minor) */}
          {showGuardianField && (
          <div className="form-group">
            <label>Guardian Name (Required for minors)<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              required
            />
          </div>
          )}
        

          {/* Religion */}
          <div className="form-group">
            <label>Religion<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              
            />
          </div>

          {/* Nationality */}
          <div className="form-group">
            <label>Nationality<span className="required-asterisk">*</span></label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              
            >
              <option value="">Select Nation</option>
              <option value="indian">Indian</option>
              <option value="others">Others</option>
            </select>
            {formData.nationality === "others" && (
              <input
                type="text"
                name="otherCountry"
                value={formData.otherCountry}
                onChange={handleChange}
                placeholder="Country Name"
                
              />
            )}
          </div>

          {/* Aadhar Number */}
          <div className="form-group">
            <label>Aadhar Number(12 digits)<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              
            />
          </div>

          {/* PAN Card Number */}
          <div className="form-group">
            <label>PAN Card Number(10 digits)<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              
            />
          </div>

          {/* Education Qualification */}
          <div className="form-group">
            <label>Education Qualification<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              
            />
          </div>

          {/* Profession */}
          <div className="form-group">
            <label>Profession<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              
            />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label>Mobile Number(10 digits)<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              
            />
          </div>

          {/* Alternate Contact Number */}
          <div className="form-group">
            <label>Alternate Contact Number(10 digits)<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="alternateContact"
              value={formData.alternateContact}
              onChange={handleChange}
              
            />
          </div>

          {/* Email ID */}
          <div className="form-group">
            <label>Email ID<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Four Wheelers */}
          <div className="form-group">
            <label>4-Wheelers</label>
            {formData.fourWheelers?.map((vehicle, index) => (
              <div key={index} className="vehicle-details">
                <h4 style={{ fontWeight: "normal", color: "#555" }}>
                  Vehicle {index + 1}
                </h4>
                <input
                  type="text"
                  name={`vehicleRegistration${index}`}
                  placeholder="Registration Number"
                  value={vehicle.registration}
                  onChange={(e) =>
                    handleFourWheelerChange(e, index, "registration")
                  }
                  
                />
                <input
                  type="text"
                  name={`vehicleParking${index}`}
                  placeholder="Parking Slot Number"
                  value={vehicle.parkingSlot}
                  onChange={(e) =>
                    handleFourWheelerChange(e, index, "parkingSlot")
                  }
                  
                />
                <input
                  type="text"
                  name={`vehicleMake${index}`}
                  placeholder="Make"
                  value={vehicle.make}
                  onChange={(e) => handleFourWheelerChange(e, index, "make")}
                  
                />
                <input
                  type="text"
                  name={`vehicleModel${index}`}
                  placeholder="Model"
                  value={vehicle.model}
                  onChange={(e) => handleFourWheelerChange(e, index, "model")}
                  
                />
                <select
                  name={`vehicleType${index}`}
                  value={vehicle.type}
                  onChange={(e) => handleFourWheelerChange(e, index, "type")}
                  
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="ICE">ICE</option>
                  <option value="EV">EV</option>
                </select>
                <button className="delete-btn" onClick={() => deleteFourWheeler(index)}>Delete</button>
              </div>
            ))}
            <button type="button" onClick={addFourWheeler}>
              + Add 4-Wheeler
            </button>
          </div>

          {/* Two Wheelers */}
          <div className="form-group">
            <label>2-Wheelers</label>
            {formData.twoWheelers?.map((vehicle, index) => (
              <div key={index} className="vehicle-details">
                <h4 style={{ fontWeight: "normal", color: "#555" }}>
                  Vehicle {index + 1}
                </h4>
                <input
                  type="text"
                  name={`vehicleRegistration${index}`}
                  placeholder="Registration Number"
                  value={vehicle.registration}
                  onChange={(e) =>
                    handleTwoWheelerChange(e, index, "registration")
                  }
                  
                />
                <input
                  type="text"
                  name={`vehicleParking${index}`}
                  placeholder="Parking Slot Number"
                  value={vehicle.parkingSlot}
                  onChange={(e) =>
                    handleTwoWheelerChange(e, index, "parkingSlot")
                  }
                  
                />
                <input
                  type="text"
                  name={`vehicleMake${index}`}
                  placeholder="Make"
                  value={vehicle.make}
                  onChange={(e) => handleTwoWheelerChange(e, index, "make")}
                  
                />
                <input
                  type="text"
                  name={`vehicleModel${index}`}
                  placeholder="Model"
                  value={vehicle.model}
                  onChange={(e) => handleTwoWheelerChange(e, index, "model")}
                  
                />
                <select
                  name={`vehicleType${index}`}
                  value={vehicle.type}
                  onChange={(e) => handleTwoWheelerChange(e, index, "type")}
                  
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="ICE">ICE</option>
                  <option value="EV">EV</option>
                </select>
                <button className="delete-btn" onClick={() => deleteTwoWheeler(index)}>Delete</button>
              </div>
            ))}
            <button type="button" onClick={addTwoWheeler}>
              + Add 2-Wheeler
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="pet-details">Pet Details</label>
            <input
              type="text"
              id="pet-details"
              name="petDetails"
              value={formData.petDetails}
              onChange={handleChange}
              placeholder="Enter pet details"
            />
          </div>

          {/* Whether Rented */}
          <div className="form-group">
            <label>Whether Rented:<span className="required-asterisk">*</span></label>
            <div className="membership-options">
              <div>
                <input
                  type="radio"
                  id="rented-yes"
                  name="rented"
                  value="yes"
                  checked={formData.rented === "yes"}
                  onChange={handleChange}
                />
                <label htmlFor="rented-yes">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="rented-no"
                  name="rented"
                  value="no"
                  checked={formData.rented === "no"}
                  onChange={handleChange}
                />
                <label htmlFor="rented-no">No</label>
              </div>
            </div>
          </div>

          {/* Residential Address (if not living in society) */}
          {formData.rented === "yes" && (
          <div className="form-group">
            <label htmlFor="residential-address">Residential Address<span className="required-asterisk">*</span></label>
            <input
              type="text"
              id="residential-address"
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              placeholder="Enter residential address"
            />
          </div>
        )}

          {/* Details of Tenants */}
          {formData.rented === "yes" && (
          <div className="form-group">
            <label>Tenant Details<span className="required-asterisk">*</span></label>
            {formData.tenants?.map((tenant, index) => (
              <div key={index} className="tenant-info">
                <h4 style={{ fontWeight: "normal", color: "#555" }}>
                  Tenant {index + 1} Details
                </h4>
                <input
                  type="text"
                  id={`tenant-name-${index}`}
                  name="name"
                  value={tenant.name}
                  onChange={(e) => handleTenantChange(e, index)}
                  placeholder="Enter name"
                  
                />
                <input
                  type="date"
                  id={`tenant-dob-${index}`}
                  name="dob"
                  value={tenant.dob}
                  onChange={(e) => handleTenantChange(e, index)}
                />

                <select
                  id={`tenant-gender-${index}`}
                  name="gender"
                  value={tenant.gender}
                  onChange={(e) => handleTenantChange(e, index)}
                  
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  id={`tenant-mobile-${index}`}
                  name="mobileNo"
                  value={tenant.mobileNo}
                  onChange={(e) => handleTenantChange(e, index)}
                  placeholder="Enter mobile number"
                  
                />
                <input
                  type="date"
                  placeholder="Date of agreement"
                  id={`tenant-agreementDate-${index}`}
                  name="agreementDate"
                  value={tenant.agreementDate}
                  onChange={(e) => handleTenantChange(e, index)}
                />
                <button className="delete-btn" onClick={() => deleteTenant(index)}>Delete</button>
              </div>
            ))}
            <button type="button" onClick={addTenant}>
              + Add Tenant
            </button>
          </div>
          )}

          {/* Declaration Checkbox */}
          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleCheckboxChange}
              />
              I hereby certify that the information furnished above is correct
              and true to my knowledge.<span className="required-asterisk">*</span>
            </label>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date<span className="required-asterisk">*</span></label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Photograph(less than 5mb)<span className="required-asterisk">*</span></label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              
            />
            {formData.photo && (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="A description of the"
                className="photo-preview"
              />
            )}
          </div>

          {/* Specimen Signature */}
          <div className="form-group">
            <label>Specimen Signature(less than 5 mb)<span className="required-asterisk">*</span></label>
            <input
              type="file"
              name="signature"
              accept="image/*"
              onChange={handleFileChange}
              
            />
            {formData.signature && (
              <img
                src={URL.createObjectURL(formData.signature)}
                alt="A description of the"
                className="signature-preview"
              />
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handlePreview}
              className="preview-button"
            >
              Preview
            </button>
          </div>
        </form>
      </div>
      {preview && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="preview-content">
            {formData.photo && (
          <div className="photo">
            <img src={URL.createObjectURL(formData.photo)} alt="Uploaded preview" />
          </div>
        )}
              {/* Membership Details */}
              <div className="preview-section">
              <div className="text-center mb-3">
          <img 
            src={logo}
            alt="Society Logo" 
            className="img-fluid" 
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
                <center><h3>Society Membership Form</h3></center>
                
          {formData.shareCertificateNo && <p><strong>Share Certificate No:</strong> {formData.shareCertificateNo}</p>}
          {(formData.firstName || formData.middleName || formData.lastName) && (
            <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
          )}
          {<p><strong>Flat Details:</strong></p>}
          {formData.wingName && <p><strong>Wing Name:</strong> {formData.wingName}</p>}
          {formData.flatNo && <p><strong>Flat No:</strong> {formData.flatNo}</p>}
          {formData.flatSize && <p><strong>Flat Size:</strong> {formData.flatSize}</p>}
          {formData.flatArea && <p><strong>Area of Flat:</strong> {formData.flatArea}</p>}
          {formData.dob && <p><strong>Date of Birth:</strong> {formData.dob}</p>}
          {formData.gender && <p><strong>Gender:</strong> {formData.gender}</p>}
          {formData.maritalStatus && <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>}
          {formData.parentOrSpouseName && (
            <p><strong>Father/Mother/Spouse Name:</strong> {formData.parentOrSpouseName}</p>
          )}
              </div>

              {/* Guardian, Religion, Nationality, Aadhar, PAN, and Other Fields */}
              <div className="preview-section">
              {formData.guardianName && (
            <p><strong>Name of Guardian (In case of Minor):</strong> {formData.guardianName}</p>
          )}
          {formData.religion && <p><strong>Religion:</strong> {formData.religion}</p>}
          {formData.nationality && <p><strong>Nationality:</strong> {formData.nationality}</p>}
          {formData.nationality === "others" && formData.otherCountry && (
            <p><strong>Other Country:</strong> {formData.otherCountry}</p>
          )}
          {formData.aadhar && <p><strong>Aadhar No:</strong> {formData.aadhar}</p>}
          {formData.panCard && <p><strong>PAN Card No:</strong> {formData.panCard}</p>}
          {formData.education && <p><strong>Educational Qualifications:</strong> {formData.education}</p>}
          {formData.profession && <p><strong>Profession:</strong> {formData.profession}</p>}
          {formData.mobileNumber && <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>}
          {formData.alternateContact && (
            <p><strong>Alternate Contact No:</strong> {formData.alternateContact}</p>
          )}
          {formData.email && <p><strong>Email ID:</strong> {formData.email}</p>}
          {formData.petDetails && <p><strong>Pet Details:</strong> {formData.petDetails}</p>}
          {formData.rented && <p><strong>Whether Rented:</strong> {formData.rented}</p>}
          {formData.residentialAddress && (
            <p><strong>Residential Address:</strong> {formData.residentialAddress}</p>
          )}
          
          {formData.date && <p><strong>Date:</strong> {formData.date}</p>}
              </div>
              {formData.jointMembers?.length > 0 && (
              <div className="preview-section">
                <h4>Joint Members</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Gender</th>
                      <th>Marital Status</th>
                      <th>Mobile Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.jointMembers.map((member, index) => (
                      <tr key={index}>
                        <td>{member.firstName} {member.middleName} {member.lastName}</td>
                        <td>{member.dob}</td>
                        <td>{member.gender}</td>
                        <td>{member.maritalStatus}</td>
                        <td>{member.mobileNumber}</td>
                        <td>{member.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
              {/* Family Members Table */}
              {formData.familyMembers?.length > 0 && (
              <div className="preview-section">
                <h4>Family Members</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Relation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.familyMembers.map((member, index) => (
                      <tr key={index}>
                        <td>{member.name}</td>
                        <td>{member.dob}</td>
                        <td>{member.relation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

              {/* Vehicles Table */}
              
              <div className="preview-section">
                
                {formData.fourWheelers?.length > 0 && (<h4>4-Wheelers</h4>)}
                {formData.fourWheelers?.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Registration No.</th>
                      <th>Parking Slot</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.fourWheelers.map((vehicle, index) => (
                      <tr key={index}>
                        <td>{vehicle.registration}</td>
                        <td>{vehicle.parkingSlot}</td>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

{formData.twoWheelers?.length > 0 && (<h4>2-Wheelers</h4>)}
                {formData.twoWheelers?.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Registration No.</th>
                      <th>Parking Slot</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.twoWheelers.map((vehicle, index) => (
                      <tr key={index}>
                        <td>{vehicle.registration}</td>
                        <td>{vehicle.parkingSlot}</td>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>


              <div className="preview-section">
              
              {formData.tenants?.length > 0 && (<h4>Details of Tenants</h4>)}
                {formData.tenants?.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Gender</th>
                      <th>Mobile Number</th>
                      <th>Agreement Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tenants.map((tenant, index) => (
                      <tr key={index}>
                        <td>{tenant.name}</td>
                        <td>{tenant.dob}</td>
                        <td>{tenant.gender}</td>
                        <td>{tenant.mobileNo}</td>
                        <td>{tenant.agreementDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              </div>

              {formData.declaration !== undefined && (
            <div className="preview-section">
            <h4>Declaration</h4>
            <div className="declaration">
              <input
                type="checkbox"
                checked={formData.declaration}
                readOnly
                style={{
                  marginRight: "10px",
                  transform: "scale(1.5)",
                  pointerEvents: "none",
                }}
              />
              <label>
                I hereby certify that the information furnished above is correct
                and true to my knowledge.
              </label>
            </div>
          </div>
          )}

              {/* Photograph and Signature */}
              {/* <div className="preview-section">
          <div className="photo-and-signature"> */}
              <div className="signature">
                <img
                  src={URL.createObjectURL(formData.signature)}
                  alt="A description of the"
                />
              </div>
              {/* </div>
        </div> */}

              {/* Download as PDF */}
              <div className="download-btn-container">
                <button onClick={handleDownload} className="download-button">
                  Download as PDF
                </button>
                <button onClick={handleSubmit} className="download-button">
                  Submit
                </button>
                <button onClick={closeModal} className="download-button">
              Edit/Close
            </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;

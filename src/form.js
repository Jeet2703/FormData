import React, { useState } from "react";
import "./form.css";
import axios from "axios";
import html2pdf from "html2pdf.js";

const UserForm = () => {
  const [formData, setFormData] = useState({
    membershipType: "",
    shareCertificateNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    flatDetails: "",
    wingName: "",
    flatNo: "",
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

  const [preview, setPreview] = useState(false); // This controls the visibility of the preview modal

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle file input changes (for photo and signature)
  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: '', dob: '', relation: '' }],
    });
  };

  const handleFamilyMemberChange = (e, index, field) => {
    const updatedFamilyMembers = [...formData.familyMembers];
    updatedFamilyMembers[index][field] = e.target.value;
    setFormData({ ...formData, familyMembers: updatedFamilyMembers });
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
        { name: "", dob: "", gender: "", mobileNo: "" },
      ],
    });
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, declaration: !formData.declaration });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file.size > 1024 * 1024) {
      alert("File size exceeds 1MB");
      return;
    }
    setFormData({ ...formData, [name]: file });
  };

  // Function to handle the preview button click
  const handlePreview = () => {
    setPreview(true); // Show preview modal when clicked
  };

  // Function to close the preview modal
  const closeModal = () => {
    setPreview(false); // Hide preview modal when clicked
  };

  // Function to handle form submission

  // Function to handle PDF download
  const handleDownload = () => {

    const options = {
      margin: 17,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
          scale: 4,
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
        margin: 17,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 4,
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

  // Validation logic
  if (!/^\d{12}$/.test(formData.aadhar)) {
    alert("Aadhar number must be 12 digits long");
    return;
  }
  if (!/^\d{10}$/.test(formData.mobileNumber)) {
    alert("Mobile number must be 10 digits long");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    alert("Invalid email address");
    return;
  }

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
      "http://localhost:5001/submit-form",
      formDataToSubmit,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (formResponse.status === 200) {
      console.log("Form data submitted successfully to MongoDB");

      // Generate the PDF as base64 string using handleDownload
      const pdfData = await handleDownload1();
      console.log("Generated PDF Data (Base64):", pdfData); // Log the PDF data

      const email1 = formData.email; // Use the user's email for "from" in the email
      const fileName = `${formData.firstName}_${formData.middleName}_${formData.lastName}_form.pdf`;
      const subj = formData.flatNo;

      // Call the send-email API
      const emailResponse = await axios.post("http://localhost:5001/send-email", {
        email1,
        pdfData,
        fileName,
        subj,
      });

      if (emailResponse.data.success) {
        alert("Form submitted and email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    }
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    alert("Error submitting the form or sending email.");
  }
};

  return (
    <div className="form-container">
      <div className="form-content">
        <h2 className="form-title">User Form</h2>
        <form>
          {/* Membership Type */}
          <div className="form-group">
            <label>Membership Type</label>
            <div className="membership-options">
              <div>
                <input
                  type="radio"
                  name="membershipType"
                  value="member"
                  onChange={handleChange}
                  checked={formData.membershipType === "member"}
                  id="member"
                />
                <label htmlFor="member">Member</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="membershipType"
                  value="jointMember"
                  onChange={handleChange}
                  checked={formData.membershipType === "jointMember"}
                  id="joint-member"
                />
                <label htmlFor="joint-member">Joint Member</label>
              </div>
            </div>
          </div>

          {/* Share Certificate No */}
          <div className="form-group">
            <label>Share Certificate No.</label>
            <input
              type="text"
              name="shareCertificateNo"
              value={formData.shareCertificateNo}
              onChange={handleChange}
              
            />
          </div>

          {/* Name Fields */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              
            />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
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
            <input
              type="text"
              name="flatDetails"
              value={formData.flatDetails}
              onChange={handleChange}
              
            />
          </div>

          {/* Wing Name */}
          <div className="form-group">
            <label>Wing Name</label>
            <input
              type="text"
              name="wingName"
              value={formData.wingName}
              onChange={handleChange}
              
            />
          </div>

          {/* Flat No */}
          <div className="form-group">
            <label>Flat No</label>
            <input
              type="text"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleChange}
              
            />
          </div>

          {/* Area of Flat */}
          <div className="form-group">
            <label>Area of Flat</label>
            <input
              type="text"
              name="flatArea"
              value={formData.flatArea}
              onChange={handleChange}
              
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
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
            <label>Marital Status</label>
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
            <label>Name of Father/ Mother/ Spouse</label>
            <input
              type="text"
              name="parentOrSpouseName"
              value={formData.parentOrSpouseName}
              onChange={handleChange}
              
            />
          </div>

          {/* Family Members */}
          <div className="form-group">
            <label>Family Members</label>
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
              </div>
            ))}
            <button type="button" onClick={addFamilyMember}>
              + Add Member
            </button>
          </div>

          {/* Guardian Name (In case of Minor) */}
          <div className="form-group">
            <label>Name of Guardian (In case of Minor)</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
            />
          </div>

          {/* Religion */}
          <div className="form-group">
            <label>Religion</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              
            />
          </div>

          {/* Nationality */}
          <div className="form-group">
            <label>Nationality</label>
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
            <label>Aadhar Number</label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              
            />
          </div>

          {/* PAN Card Number */}
          <div className="form-group">
            <label>PAN Card Number</label>
            <input
              type="text"
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              
            />
          </div>

          {/* Education Qualification */}
          <div className="form-group">
            <label>Education Qualification</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              
            />
          </div>

          {/* Profession */}
          <div className="form-group">
            <label>Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              
            />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              
            />
          </div>

          {/* Alternate Contact Number */}
          <div className="form-group">
            <label>Alternate Contact Number</label>
            <input
              type="text"
              name="alternateContact"
              value={formData.alternateContact}
              onChange={handleChange}
              
            />
          </div>

          {/* Email ID */}
          <div className="form-group">
            <label>Email ID</label>
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
            <label>Whether Rented:</label>
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
          <div className="form-group">
            <label htmlFor="residential-address">Residential Address</label>
            <input
              type="text"
              id="residential-address"
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              placeholder="Enter residential address"
            />
          </div>

          {/* Details of Tenants */}
          <div className="form-group">
            <label>Tenant Details</label>
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
              </div>
            ))}
            <button type="button" onClick={addTenant}>
              + Add Tenant
            </button>
          </div>

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
              and true to my knowledge.
            </label>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Photograph</label>
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
            <label>Specimen Signature</label>
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
              <div className="photo">
                <img src={URL.createObjectURL(formData.photo)} 
                alt="A description of the"
                />
              </div>
              {/* Membership Details */}
              <div className="preview-section">
                <center><h3>Membership Details</h3></center>
                <p>
                  <strong>Membership Type:</strong> {formData.membershipType}
                </p>
                <p>
                  <strong>Share Certificate No:</strong>{" "}
                  {formData.shareCertificateNo}
                </p>
                <p>
                  <strong>Name:</strong> {formData.firstName}{" "}
                  {formData.middleName} {formData.lastName}
                </p>
                <p>
                  <strong>Flat Details:</strong> {formData.flatDetails}
                </p>
                <p>
                  <strong>Wing Name:</strong> {formData.wingName}
                </p>
                <p>
                  <strong>Flat No:</strong> {formData.flatNo}
                </p>
                <p>
                  <strong>Area of Flat:</strong> {formData.flatArea}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {formData.dob}
                </p>
                <p>
                  <strong>Gender:</strong> {formData.gender}
                </p>
                <p>
                  <strong>Marital Status:</strong> {formData.maritalStatus}
                </p>
                <p>
                  <strong>Father/Mother/Spouse Name:</strong>{" "}
                  {formData.parentOrSpouseName}
                </p>
              </div>

              {/* Guardian, Religion, Nationality, Aadhar, PAN, and Other Fields */}
              <div className="preview-section">
                <p>
                  <strong>Name of Guardian (In case of Minor):</strong>{" "}
                  {formData.guardianName}
                </p>
                <p>
                  <strong>Religion:</strong> {formData.religion}
                </p>
                <p>
                  <strong>Nationality:</strong> {formData.nationality}
                </p>
                {formData.nationality === "others" && (
                  <p>
                    <strong>Other Country:</strong> {formData.otherCountry}
                  </p>
                )}
                <p>
                  <strong>Aadhar No:</strong> {formData.aadhar}
                </p>
                <p>
                  <strong>PAN Card No:</strong> {formData.panCard}
                </p>
                <p>
                  <strong>Educational Qualifications:</strong>{" "}
                  {formData.education}
                </p>
                <p>
                  <strong>Profession:</strong> {formData.profession}
                </p>
                <p>
                  <strong>Mobile Number:</strong> {formData.mobileNumber}
                </p>
                <p>
                  <strong>Alternate Contact No:</strong>{" "}
                  {formData.alternateContact}
                </p>
                <p>
                  <strong>Email ID:</strong> {formData.email}
                </p>
                <p>
                  <strong>Pet Details:</strong> {formData.petDetails}
                </p>
                <p>
                  <strong>Whether Rented:</strong> {formData.rented}
                </p>
                <p>
                  <strong>Residential Address:</strong>{" "}
                  {formData.residentialAddress}
                </p>
                <p>
                  <strong>Declaration:</strong>{" "}
                  {formData.declaration ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Date:</strong> {formData.date}
                </p>
              </div>

              {/* Family Members Table */}
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

              {/* Vehicles Table */}
              <div className="preview-section">
                <h4>4-Wheelers</h4>
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

                <h4>2-Wheelers</h4>
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
              </div>

              <div className="preview-section">
                <h4>Details of Tenants</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Gender</th>
                      <th>Mobile Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tenants.map((tenant, index) => (
                      <tr key={index}>
                        <td>{tenant.name}</td>
                        <td>{tenant.dob}</td>
                        <td>{tenant.gender}</td>
                        <td>{tenant.mobileNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

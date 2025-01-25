const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect(
  // "mongodb+srv://shahjeet64:ZNIsezGUlnm1o4vO@cluster0.zarb9en.mongodb.net/formData?retryWrites=true&w=majority",
  "mongodb+srv://vina:tR5wYfwkAFZ4IjJF@cluster0.5kwfa.mongodb.net/formData?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Check MongoDB connection
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(bodyParser.json({ limit: "10mb" })); // Increased limit for large PDFs
app.use(cors());

app.get("/ping", (req, res) => {
  res.send({ message: "pong" });
});

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// MongoDB Schema for form data
const formDataSchema = new mongoose.Schema({
  jointMembers: [
    {
      firstName: String,
      middleName: String,
      lastName: String,
      dob: Date,
      gender: String,
      maritalStatus: String,
      mobileNumber: String,
      email: String,
    },
  ],
  shareCertificateNo: String,
  firstName: String,
  middleName: String,
  lastName: String,
  wingName: String,
  flatSize: String,
  flatNo: String,
  flatArea: String,
  dob: Date,
  gender: String,
  maritalStatus: String,
  parentOrSpouseName: String,
  familyMembers: [
    {
      name: String,
      dob: Date,
      relation: String,
    },
  ],
  guardianName: String,
  religion: String,
  nationality: String,
  otherCountry: String,
  aadhar: String,
  panCard: String,
  education: String,
  profession: String,
  mobileNumber: String,
  alternateContact: String,
  email: String,
  fourWheelers: [
    {
      ownerShip: String,
      registrationNo: String,
      parkingSlot: String,
      make: String,
      model: String,
      type: String, // ICE or EV
    },
  ],
  twoWheelers: [
    {
      ownership: String,
      registrationNo: String,
      parkingSlot: String,
      make: String,
      model: String,
      type: String, // ICE or EV
    },
  ],
  tenants: [
    {
      name: String,
      dob: Date,
      gender: String,
      mobileNo: String,
      agreementDate: Date,
    },
  ],
  petDetails: String,
  rented: String,
  residentialAddress: String,
  declaration: String,
  date: Date,
  photo: String,
  signature: String,
});

// Model for form data
const FormData = mongoose.model("FormData", formDataSchema);

// Route to handle form data submission
app.post(
  "/submit-form",
  upload.fields([{ name: "photo" }, { name: "signature" }]),
  async (req, res) => {
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
      fourWheelers,
      twoWheelers,
      tenants,
      petDetails,
      rented,
      residentialAddress,
      declaration,
      date,
    } = req.body;

    console.log('Incoming formData:', req.body);

    try {
      // Check if email already exists
      const existingForm = await FormData.findOne({ email });
      if (existingForm) {
        return res
          .status(400)
          .json({ success: false, message: "Email already used" });
      }

      const photo = req.files["photo"] ? req.files["photo"][0].path : null;
      const signature = req.files["signature"] ? req.files["signature"][0].path : null;

      const formData = new FormData({
        jointMembers: JSON.parse(jointMembers),
        shareCertificateNo,
        firstName,
        middleName,
        lastName,
        wingName,
        flatNo,
        flatSize,
        flatArea,
        dob: new Date(dob),
        gender,
        maritalStatus,
        parentOrSpouseName,
        familyMembers: JSON.parse(familyMembers),
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
        email,
        fourWheelers,
        twoWheelers,
        tenants: JSON.parse(tenants),
        petDetails,
        rented,
        residentialAddress,
        declaration,
        date: new Date(date),
        photo,
        signature,
      });

      await formData.save();
      res.status(200).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ success: false, message: "Error saving data", error });
    }
  }
);



// Route to send email
app.post("/send-email", async (req, res) => {
  const { email1, pdfData, fileName, subj } = req.body;

  try {
    if (!pdfData || !fileName) {
      return res.status(400).json({ success: false, error: "Missing pdfData or fileName" });
    }

    const pdfBuffer = Buffer.from(pdfData.split(",")[1], "base64");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bajajemerald69@gmail.com",
        pass: "pwsw zryx rzey mhyv",
      },
    });

    const mailOptions = {
        from: `Form Submission <bajajemerald69@gmail.com>`, // Must match the authenticated account
        replyTo: email1,
        to: "bajajemerald69@gmail.com", // Receiver's email
        subject: subj,
        text: `You have received a form submission from: ${email1}.`,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

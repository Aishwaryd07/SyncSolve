
const User = require('../models/user.model')
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const auth_config = require("../config/auth.config")

const secretKey = auth_config.secretKey;

exports.register =  async (req, res) => {
    try {
      //console.log(req.body);
      const { email,firstName } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  
      // Save user details to the database
      const newUser = new User({
        email,
        otp,
        firstName,
      });
      await newUser.save();
  
      // Send OTP to the user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: auth_config.email, // Your Gmail email address
          pass: auth_config.password, // Your Gmail password or an application-specific password
        },
      });
  
      const mailOptions = {
        from: "aishdandale7@gmail.com",
        to: email,
        subject: "OTP for Registration",
        text: `Your OTP for registration is ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Failed to send OTP" });
        }
        res.status(200).json({ message: "OTP sent successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
};

exports.verifyOtp = async (req, res) => {
  try {
    console.log(req.body);

    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify the provided OTP against the stored OTP in the user document
    const isOtpValid = otp && user.otp === otp;

    if (!isOtpValid) {
      //add logic to remove user from the database 
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear the OTP in the user document after successful login (optional for one-time use)
    user.otp = undefined;
    await user.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1d",
      });
      console.log('logged in successfully');
      res.json({ message: 'Logged in successfully', token, user });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.setPassword = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      user_id ,
      { password },
      { new: true } 
    );

    if (updatedUser) {
      res.status(200).json({ message: 'Password set successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.getUser = async (req, res) => {
  try {
    // console.log(`user received in auth controller :`);
    // console.log(req.user);
    const user = await User.findOne({ _id : req.user.userId });
    user.password = "";
    res.json({ user });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
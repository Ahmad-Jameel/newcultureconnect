const User = require("../models/user.model");
const sequelize = require("../config");
const jwtToken = require("jsonwebtoken");
const crypto = require("crypto");
const {
  email_to_reported_id_user,
  update_of_reported_post,
  PaymentConfirmation
} = require("./nodemailer.emailservice");
const Image_Post = require("../models/imagePost.model");
const Video_Post = require("../models/videoPost.model");
const multer = require("multer");
const errorHandler = require("../utlis/errorhandandler");
const { Op } = require("sequelize");
const Native = require("../models/native.model");
const Reports = require("../models/Reports.model");
const Blogs = require("../models/blogs.model");
const Ads = require("../models/ads.model")
const Notification = require("../models/notification.model")
const NotificationsOpenOrNot = require("../models/notfication_open_or_not")
const Payment = require("../models/Payment.model")
const Chatbox = require("../models/chatbox.model");
const Admin = require("../models/admin.model")

const fetch_all_reports = async (req, res) => {
  try {

    const users = await Reports.findAll({
      order: [
        ['createdAt', 'DESC'] // Order by 'createdAt' in descending order
      ]
    });

    res.send(users);
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};

const search_post_by_id = async (req, res) => {
  let postid = req.query.id;
  let posttype = req.query.postType;

  console.log("-----------------", postid, posttype);

  if (posttype == "image") {
    const Imagedata = await Image_Post.findOne({
      where: {
        ImageID: postid,
      },
    });

    if (!Imagedata) {
      return res.status(404).send("Image data not found");
    }

    const postUserID = Imagedata.UserID;

    let emailRecord = await User.findOne({
      where: { UserID: postUserID },
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: postUserID },
      });
    }

    const responseData = {
      Imagedata,
      email: emailRecord,
    };

    res.send(responseData);
  } else if (posttype == "video") {
    const Imagedata = await Video_Post.findOne({
      where: {
        VideoID: postid,
      },
    });

    if (!Imagedata) {
      return res.status(404).send("Image data not found");
    }

    const postUserID = Imagedata.UserID;

    let emailRecord = await User.findOne({
      where: { UserID: postUserID },
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: postUserID },
      });
    }

    const responseData = {
      Imagedata,
      email: emailRecord,
    };

    res.send(responseData);
  } else if (posttype == "blog") {
    const Imagedata = await Blogs.findOne({
      where: {
        BlogsID: postid,
      },
    });

    if (!Imagedata) {
      return res.status(404).send("Image data not found");
    }

    const postUserID = Imagedata.UserID;

    let emailRecord = await User.findOne({
      where: { UserID: postUserID },
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: postUserID },
      });
    }

    const responseData = {
      Imagedata,
      email: emailRecord,
    };

    res.send(responseData);

    console.log("-----------blogdata", responseData)
  } else {
    res.send("no data found");
    console.log("no data found");
  }
};



const Delete_post = async (req, res) => {
  try{
    let postid = req.query.id;
  let posttype = req.query.postype;
  let email = req.query.email;
  let name = req.query.name;
  let date = req.query.date;
  let postcategory = req.query.postcategory
    
   

  console.log("-----------------", postid, posttype);

  if (posttype == "image") {
    await Image_Post.destroy({
      where: {
        ImageID: postid,
      },
    });
    await email_to_reported_id_user(email, name, date, posttype, postcategory);

    res.send("deleted");
  } else if (posttype == "video") {
    await Video_Post.destroy({
      where: {
        VideoID: postid,
      },
    });
    await email_to_reported_id_user(email, name, date, posttype, postcategory);

    res.send("deleted");
  } else if (posttype == "blog") {
     await Blogs.destroy({
      where: {
        BlogsID: postid,
      },
    });
    await email_to_reported_id_user(email, name, date, posttype, postcategory);

    res.send("deleted");

  } else {
    res.send("no data found");
    console.log("no data found");
  }

  }
  catch (error) {
    console.error("Failed to save report data: ", error);
    res.status(500).send({ message: "Failed to save report data" });
  }

}


const update_reporter_query = async (req, res) => {


  const ID = req.body.id;
  const date = req.body.createdAt;
  const post_id = req.body.Reported_Post_ID;
  const posttype = req.body.postType;
  const reporttitle = req.body.Reporttitle;
  const report_reason = req.body.reportjustification;
  const reporter_email = req.body.Reporter_email;
  const query_answer = req.body.queryanswer;

  console.log("--", ID);

  

  try {

    await Reports.update(
      {
        // The fields and values to update
        reportstatus: true,
        queryanswer: query_answer
      },
      {
        where: {
          id: ID
        }
      }
    );

    let nameResult = await User.findOne({
      where: { Email: reporter_email },
      attributes: ['Name']
    });
    
    // Check if a User was found, otherwise try finding in Native
    if (!nameResult) {
      nameResult = await Native.findOne({
        where: { Email: reporter_email },
        attributes: ['Name']
      });
    }
    
    // Extract the Name from dataValues
    const Name = nameResult ? nameResult.dataValues.Name : null;


    await update_of_reported_post(reporter_email,  Name,  posttype, date, reporttitle,  query_answer);
    res.status(201).send({ message: "Report successfully submitted and email sent." });
  } catch (error) {
    console.error("Failed to save report data: ", error);
    res.status(500).send({ message: "Failed to save report data" });
  }
};







const adsGifStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/ads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const adsGifFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(gif|GIF|jpg|JPG|jpeg|JPEG|png|PNG|mp4|MP4|avi|AVI|mov|MOV)$/)) {
    req.fileValidationError = 'Only GIF, JPG, PNG, and video files (MP4, AVI, MOV) are allowed!';
    return cb(new Error('Only GIF, JPG, PNG, and video files (MP4, AVI, MOV) are allowed!'), false);
}
  cb(null, true);
};

const adsGifUpload = multer({ 
  storage: adsGifStorage,
  fileFilter: adsGifFileFilter
});

function calculateExpiryDate(duration) {
  const durationMap = {
    '1 Day': { days: 1 },
    '1 week': { days: 7 },
    '15 days': { days: 15 },
    '1 month': { days: 30 },
    '2 months': { days: 60 },
    '5 months': { days: 150 },
    '1 Year': { days: 365 },
    '1 minute': { minutes: 1 },
    '5 minutes': { minutes: 5 }
  };

  const currentDate = new Date();
  
  if (durationMap[duration].hasOwnProperty('days')) {
    currentDate.setDate(currentDate.getDate() + durationMap[duration].days);
  } else if (durationMap[duration].hasOwnProperty('minutes')) {
    currentDate.setMinutes(currentDate.getMinutes() + durationMap[duration].minutes);
  } else {
    throw new Error(`Invalid duration: ${duration}`);
  }

  return currentDate.toISOString();
}



const add_ads = async (req, res) => {
  try {
    await adsGifUpload.single('AdsGif')(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err) {
        return res.status(500).send(err.message);
      }
  
      try {
        let expiryDate;
        try {
          expiryDate = calculateExpiryDate(req.body.duration);
        } catch (error) {
          return res.status(400).send({ message: error.message });
        }

        const adsRecord = await Ads.create({
          AdsTitle: req.body.title,
          AdsGif: req.file.path,
          Ad_Duration: req.body.duration,
          StartDate: new Date().toISOString(), 
          ExpiryDate: expiryDate 
        });
  
        console.log("Uploaded ads GIF:", adsRecord);
        res.send("Successfully added record for the uploaded ads GIF.");
      } catch (error) {
        console.error("Failed to create new ad record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process ads upload: ", error);
    res.status(500).send(error.message);
  }
};

const display_add = async (req, res) => {
  try {
    const count = await Ads.count();

    if (count > 0) {
      const random = Math.floor(Math.random() * count);
      const randomAd = await Ads.findOne({ offset: random });

      if (!randomAd) {
        return res.status(404).send('No ads found.');
      }
      res.status(200).json(randomAd);
    } else {
      res.status(404).send('No ads found.');
    }
  } catch (error) {
    console.error("Failed to retrieve random ad: ", error);
    res.status(500).send(error.message);
  }
};



const saveNotificationData = async (req, res) => {
  try {

    await Notification.create({
      Notification_Title: req.body.Notification_Title,
      Notification_Description: req.body.Notification_Description,
      Date: req.body.Date,
      Time: req.body.Time,
      City: req.body.City,
      Area: req.body.Area,
      State: req.body.State,
      AddressNumber: req.body.AddressNumber,
    });

    await NotificationsOpenOrNot.update({ Notification_status: true }, {
      where: {}
    });
  

    res.status(201).send({ message: "Notification successfully submitted." });

    
  } catch (error) {
    console.error("Failed to save notification data: ", error);
    res.status(500).send({ message: "Failed to save notification data" });
  }
};


const fetchAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).send("Error fetching notifications");
  }
}



const fetchAllPaymentData = async (req, res) => {
  try {
    const PaymentData = await Payment.findAll({
      
      order: [['createdAt', 'DESC']]
    });
    res.json(PaymentData);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).send("Error fetching notifications");
  }
}

const paymentConfirmation = async (req, res) => {
  try {
    // Extract reportId from query parameters
    const { reportId } = req.query;
    console.log("---------------------------------",reportId)
    
    // Assuming PaymentConfirmation() requires the reportId as an argument
    await PaymentConfirmation();
    console.log("--------------------eamil sended")
    // Send a success response
    res.status(200).json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};




const signInAdmin = async (req, res) => {

  
  try {
    
    await sequelize.sync();

    const pass = req.body.pass;
  console.log("-------", pass)

    const admin = await Admin.findOne({
      where: {
        Password: req.body.pass,
        Email: req.body.email
      }
    });

    

    if (!admin) {
      console.error("Invalid Credentials!");
      res.status(401).send("Invalid Credentials");
    } else {
      // Assuming admin also has an is_Online flag or similar
      admin.is_Online = true;
      await admin.save();

      // Generate a token for the admin. Note that the 'role' is now 'admin'
      const token = jwtToken.sign({ role: "admin" }, 'dfghjk');

      // Fetching admin-specific info, assuming Admin model has a different structure
      const admin_ID = await Admin.findOne({
        attributes: ['AdminID', 'role'], // Adjust attribute names as necessary
        where: {
          Email: req.body.email
        }
      });

      console.log(admin);

      res.status(200).send({
        admin_ID,
        roles: token.role,
        accessToken: token
      });

      res.send("admin loged in")
    }
  } catch (error) {
    console.error("Failed to sign in token not created: ", error);
    res.status(500).send(error.message);
  }
};


const Signup = async(req, res) =>{

  const admin = await Admin.create({
    Email: req.body.email,
    Password: req.body.pass
  });

  console.log("signuped--in")
}



module.exports = {
  fetch_all_reports,
  search_post_by_id,
  Delete_post,
  update_reporter_query ,
  add_ads,
  display_add,
  saveNotificationData,
  fetchAllNotifications,
  fetchAllPaymentData,
  paymentConfirmation,
  Signup,
  signInAdmin
  
};

const User = require("../models/user.model");
const sequelize = require("../config");
const jwtToken = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  report_confirm_email,
} = require("./nodemailer.emailservice");
const Image_Post = require("../models/imagePost.model");
const Video_Post = require("../models/videoPost.model");
const multer = require("multer");
const errorHandler = require("../utlis/errorhandandler");
const { Op } = require("sequelize");
const Native = require("../models/native.model");
const Reports = require("../models/Reports.model");
const NotificationsOpenOrNot = require("../models/notfication_open_or_not");
const Notification = require("../models/notification.model");
const Payment = require("../models/Payment.model");
const Comment = require("../models/comment.like.model");

const Chatbox = require("../models/chatbox.model");

const CardPayment = require("../models/Payment_with_card");
require("dotenv").config();
const stripe = require("stripe")(process.env.Stripe_Secret_Key);

const { OpenAI } = require("openai");


const openai = new OpenAI(process.env.OPENAI_API_KEY);


const Payment_via_card = async (req, res) => {
  const { payment_method_id, amount, success_url, cancel_url } = req.body; 

  console.log("---------------------------all data ", payment_method_id)

  try {
    // Convert amount to cents (for Stripe) if not already done so
    const paymentAmount = amount * 100; // Assuming amount is passed in dollars

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: payment_method_id,
      amount: paymentAmount,
      currency: 'usd',
      //confirmation_method: 'manual',
      confirm: true,
      return_url: success_url,
      automatic_payment_methods: { enabled: true },
      
    });

   
    const newPayment = await CardPayment.create({
      Amount: paymentIntent.amount, 
    });

    res.status(200).json({
      message: "Payment successful",
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: error.message });
  }
};



const allSocialMediaPosts = async (req, res) => {
  try {
    await sequelize.sync();

    const excludedUserId = req.query.id;

    const AllUsersID = await User.findAll({
      where: {
        UserID: { [Op.ne]: excludedUserId },
      },
      attributes: ["UserID"],
    });

    const AllUsersIDs = [...new Set(AllUsersID.map((entry) => entry.UserID))];

    console.log(AllUsersIDs);

    const Userphoto = await User.findAll({
      where: { UserID: { [Op.in]: AllUsersIDs } },
    });
    const images = await Image_Post.findAll({
      where: { UserID: { [Op.in]: AllUsersIDs } },
    });
    const videos = await Video_Post.findAll({
      where: { UserID: { [Op.in]: AllUsersIDs } },
    });

    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Media fetched and sorted successfully.");
    res.status(200).send({ Userphoto, combinedMedia });
  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const model_name = "gpt-4";
const model2_name = "gpt-4";

const check_chat_exist_or_not = async (req, res) => {
  const senderId = req.query.sender_id;
  const receiverId = req.query.id;

  console.log("==============================", { senderId, receiverId });

  try {
    const existingChat = await Chatbox.findOne({
      where: {
        sender_id: senderId,
        Receiver_Id: receiverId,
      },
    });

    if (!existingChat) {
      const newChat = await Chatbox.create({
        sender_id: senderId,
        Receiver_Id: receiverId,
      });
      console.log("New chat saved:", newChat);
      res.status(200).send("New chat saved");
    } else {
      res.status(203).send("Chat already exists");
    }
  } catch (error) {
    console.error("Error checking or creating chat:", error);
    res.status(500).send("Internal server error");
  }
};

const add_chats = async (req, res) => {
  try {
    const senderId = req.query.sender_id;

    // Fetch all distinct user IDs that this user has had a chat with
    const chats = await Chatbox.findAll({
      where: {
        [Op.or]: [{ sender_id: senderId }, { Receiver_Id: senderId }]
      },
      group: ['sender_id', 'Receiver_Id'],
      attributes: ['sender_id', 'Receiver_Id'],
      raw: true
    });

    // Extract user IDs excluding the current user
    const userIds = chats.reduce((acc, chat) => {
      if (chat.sender_id !== senderId && !acc.includes(chat.sender_id)) {
        acc.push(chat.sender_id);
      }
      if (chat.Receiver_Id !== senderId && !acc.includes(chat.Receiver_Id)) {
        acc.push(chat.Receiver_Id);
      }
      return acc;
    }, []);

   // Fetch user details for all connected user IDs
   const users = await User.findAll({
    where: { UserID: { [Op.in]: userIds } },
    attributes: ['UserID', 'Name', 'Profile_pic'],
  });

  // Fetch native details for all connected user IDs
  const natives = await Native.findAll({
    where: { UserID: { [Op.in]: userIds } },
    attributes: ['UserID', 'Name', 'Profile_pic'],
  });

  // Combine user and native data
  const combinedData = users.map(user => ({
    ...user.toJSON(),
    isNative: false,
  }));

  natives.forEach(native => {
    combinedData.push({
      ...native.toJSON(),
      isNative: true,
    });
  });

  res.status(200).send({ users: combinedData });
  
  } catch (error) {
    console.error("Error in operation: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};


const allusers = async (req, res) => {
  try {
    const excludedUserId = req.query.excludeId;


    const users = await User.findAll({
      where: {
        UserID: { [Op.ne]: excludedUserId },
      },
      attributes: ["UserID", "Name", "Profile_pic", "is_Online"],
    });

    res.send(users);
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};

const see_other_user_profile = async (req, res) => {
  try {
    await sequelize.sync();

    const Userphoto = await User.findOne({
      where: { UserID: req.query.id },
      attributes: ["UserID", "Name", "Profile_pic", "Cover_photo"],
    });
    const images = await Image_Post.findAll({
      where: { UserID: req.query.id },
    });
    const videos = await Video_Post.findAll({
      where: { UserID: req.query.id },
    });

    console.log("-----------", Userphoto);

    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    console.log("Media fetched and sorted successfully.", combinedMedia);
    res.status(200).send({ Userphoto, combinedMedia });
  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//---------get sepecific social post data---------

const get_imagePost_for_update = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      Image_Post.findOne({
        where: {
          id: req.body.id,
        },
      })
        .then((rs) => {
          console.log(rs);
          res.send("data got");
        })
        .catch((error) => {
          console.error("Failed to retrieve data : ", error);
        });
    })
    .catch((error) => {
      console.error("Unable to create table : ", error);
    });
};

const get_videoPost_for_update = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      Video_Post.findOne({
        where: {
          id: req.body.id,
        },
      })
        .then((rs) => {
          console.log(rs);
          res.send("data got");
        })
        .catch((error) => {
          console.error("Failed to retrieve data : ", error);
        });
    })
    .catch((error) => {
      console.error("Unable to create table : ", error);
    });
};

//-------------DELETE SOCIAL POST--------------
const deleteImagePost = async (req, res) => {
  try {
    await sequelize.sync();

    const result = await Image_Post.destroy({
      where: { id: req.body.id },
    });

    if (!result) {
      return res.status(404).send(new errorHandler("ID does not exist", 404));
    }

    console.log("Successfully deleted record.");
    return res.status(200).send("Data deleted");
  } catch (error) {
    console.error("Failed to delete record:", error);
    return res.status(500).send(error.message);
  }
};

const deleteVideoPost = async (req, res) => {
  try {
    await sequelize.sync();

    const result = await Video_Post.destroy({
      where: { id: req.body.id },
    });

    if (!result) {
      return res.status(404).send(new errorHandler("ID does not exist", 404));
    }

    console.log("Successfully deleted record.");
    return res.status(200).send("Data deleted");
  } catch (error) {
    console.error("Failed to delete record:", error);
    return res.status(500).send(error.message);
  }
};

//---------setting of multer---------
const image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const image_fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(gif|GIF|jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const image_upload = multer({
  storage: image_storage,
  fileFilter: image_fileFilter,
});

const video_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/videos");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const video_fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(gif|GIF|mp4|MP4|mov|MOV)$/)) {
    req.fileValidationError = "Only video files are allowed!";
    return cb(new Error("Only video files are allowed!"), false);
  }
  cb(null, true);
};

const add_video_post = multer({
  storage: video_storage,
  fileFilter: video_fileFilter,
});

//------------retrive user data for update profile---------
const retrive_user_data = async (req, res) => {
  try {
    await sequelize.sync();

    console.log(req.query.id);

    // Use findOne to get a single user object
    const user = await User.findOne({ where: { UserID: req.query.id } });

    if (!user) {
      return res.status(404).send("No user found");
    }

    console.log("User data displayed");
    res.status(200).send(user); // Send the user object directly
  } catch (error) {
    console.error("Error fetching user data: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//------------UPDATE PROFILE------------
const update_Profile = async (req, res) => {
  image_upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "profile_image", maxCount: 1 },
  ])(req, res, async (err) => {
    if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    }
    if (err) {
      return res.status(500).send(err.message);
    }

    try {
      // Determine paths for cover and profile images
      const coverImagePath = req.files["cover_image"]
        ? req.files["cover_image"][0].path
        : null;
      const profileImagePath = req.files["profile_image"]
        ? req.files["profile_image"][0].path
        : null;

      // Prepare the update data
      const updateData = {
        Name: req.body.name,
        FirstName: req.body.fname,
        LastName: req.body.lname,
        PhoneNumber: req.body.pnum,
      };

      // Update image paths only if new images are provided
      if (coverImagePath) {
        updateData.Cover_photo = coverImagePath;
      }
      if (profileImagePath) {
        updateData.Profile_pic = profileImagePath;
      }

      // Update user profile in the database
      const [updatedRows] = await User.update(updateData, {
        where: { UserID: req.body.id },
      });
      if (updatedRows === 0) {
        res.status(404).send("User not found or no data updated");
      } else {
        res.status(200).send("Data updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      res.status(500).send(error.message);
    }
  });
};

//------------------------------------------------------------------------------------------test-----------------------
//-------RETRIVE ALL MEDIA DATA----------
const allMedia = async (req, res) => {
  try {
    await sequelize.sync();

    const Userphoto = await User.findAll({ where: { UserID: req.query.id } });
    const images = await Image_Post.findAll({
      where: { UserID: req.query.id },
    });
    const videos = await Video_Post.findAll({
      where: { UserID: req.query.id },
    });

    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    console.log("Media fetched and sorted successfully.");
    res.status(200).send({ Userphoto, combinedMedia });
  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//----------IMAGE-----------

const update_image_Post = async (req, res) => {
  try {
    await image_upload.single("image")(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err && !req.body.existingImagePath) {
        return res.status(500).send(err.message);
      }

      try {
        await sequelize.sync();
        console.log("Images table synced successfully!");

        const imagePath = req.file ? req.file.path : req.body.existingImagePath;

        await Image_Post.update(
          {
            picture: imagePath,
            img_caption: req.body.caption,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );

        console.log("image updated:");
        res.send("Successfully updated record for the image.");
      } catch (error) {
        console.error("Failed to update new record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process upload: ", error);
    res.status(500).send(error.message);
  }
};

const add_image_Post = async (req, res) => {
  try {
    await image_upload.single("image")(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err) {
        return res.status(500).send(err.message);
      }

      try {
        await sequelize.sync();
        console.log("Images table synced successfully!");

        await Image_Post.create({
          picture: req.file.path,
          UserID: req.body.id,
          img_caption: req.body.caption,
        });

        console.log("Uploaded file:");
        res.send("Successfully added record for the uploaded image.");
      } catch (error) {
        console.error("Failed to create new record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process upload: ", error);
    res.status(500).send(error.message);
  }
};

//----------VIDEO-----------

const update_video_Post = async (req, res) => {
  try {
    await add_video_post.single("video")(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err && !req.body.existingVideoPath) {
        return res.status(500).send(err.message);
      }

      try {
        await sequelize.sync();
        console.log("Video table synced successfully!");

        const videoPath = req.file ? req.file.path : req.body.existingVideoPath;

        await Video_Post.update(
          {
            Video: videoPath,
            Captions: req.body.caption,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );

        console.log("video updated");
        res.send("Successfully updated record for the video.");
      } catch (error) {
        console.error("Failed to update new record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process upload: ", error);
    res.status(500).send(error.message);
  }
};

const upload_video_Post = async (req, res) => {
  try {
    await add_video_post.single("video")(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err) {
        return res.status(500).send(err.message);
      }

      try {
        await sequelize.sync();
        console.log("Video table synced successfully!");

        await Video_Post.create({
          Video: req.file.path,
          Captions: req.body.text,
          UserID: req.body.id,
        });

        console.log("Uploaded file:", req.file);
        res.send("Successfully added record for the video.");
      } catch (error) {
        console.error("Failed to create new record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process upload: ", error);
    res.status(500).send(error.message);
  }
};

////---------------------SignUP----------------

let temporaryUsers = {};
const signUpUser = async (req, res) => {
  try {
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    temporaryUsers[verificationCode] = {
      FirstName: req.body.fname,
      LastName: req.body.lname,
      Name: req.body.name,
      Email: req.body.email,
      Password: req.body.pass,
      PhoneNumber: req.body.pnum,
    };

    console.log(temporaryUsers);

    await sendVerificationEmail(req.body.email, verificationCode);
    res.send("Verification code sent to email.");
  } catch (error) {
    console.error("Error in signUpUser: ", error);
    res.status(500).send(error.message);
  }
};

const verifyUser = async (req, res) => {
  let counter = 0;
  try {
    console.log("Received verification code:", req.body.verificationCode);
    const { verificationCode } = req.body;
    console.log(temporaryUsers);
    const tempUser = temporaryUsers[verificationCode];
    console.log(tempUser);

    if (!tempUser) {
      return res.status(400).send("Invalid verification code");
    }

    const newUser = await User.create({
      ...tempUser,
      role: "user",
      isVerified: true,
    });

    await NotificationsOpenOrNot.create({
      UserEmail: tempUser.Email,
    });

    console.log("------------email", tempUser.Email);
    delete temporaryUsers[verificationCode];

    res.send("User verified and registered successfully");
    console.log("-----------registered");
  } catch (error) {
    console.error("Error in verifyUser: ", error);
    res.status(500).send(error.message);
  }
};

const signInUser = async (req, res) => {
  try {
    await sequelize.sync();
    const user = await User.findOne({
      where: {
        Password: req.body.pass,
        Email: req.body.email,
      },
    });

    if (!user) {
      console.error("Invalid Credentials!");
      res.status(401).send("Invalid Credentials");
    } else {
      user.is_Online = true;
      await user.save();
      const token = jwtToken.sign({ role: "user" }, "dfghjk");

      const user_ID = await User.findOne({
        attributes: ["UserID", "role"],
        where: {
          Email: req.body.email,
        },
      });

      console.log(user);

      res.status(200).send({
        user_ID,
        roles: token.Role,
        accessToken: token,
      });
    }
  } catch (error) {
    console.error("Failed to sign in token not created: ", error);
    res.status(500).send(error.message);
  }
};

//---------------------------ForgetPASSWORD----------------------
let temp_forget_pass = 0;
let temp_forgetpass_email = "";
const verify_forget_Password_email = async (req, res) => {
  try {
    await sequelize.sync();

    const user = await User.findOne({
      where: {
        Email: req.body.email,
      },
    });

    if (user) {
      const forgetpass_verificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
      await sendVerificationEmail(req.body.email, forgetpass_verificationCode);
      res.send("Verification code sent to your email");
      console.log(forgetpass_verificationCode);

      temp_forget_pass = forgetpass_verificationCode;
      temp_forgetpass_email = req.body.email;
    } else {
      res.status(404).send("Email not found");
    }
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).send(error.message);
  }
};

let isVerified = false;
const verify_forgetpass = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    if (temp_forget_pass !== verificationCode) {
      return res.status(400).send("Invalid verification code");
    }

    isVerified = true;
    res.send("User verified. You can now change your password.");
  } catch (error) {
    console.error("Error in verifyUser: ", error);
    res.status(500).send(error.message);
  }
};

const change_password = async (req, res) => {
  try {
    if (!isVerified) {
      return res.status(403).send("canot update the password");
    }

    await sequelize
      .sync()
      .then(async () => {
        await User.update(
          {
            Password: req.body.pass,
          },
          {
            where: { Email: temp_forgetpass_email },
          }
        )
          .then((data) => {
            if (!data) {
              res.send(new errorHandler("Email do not exist ", 404));
            } else {
              console.log("Successfully updated record.");
              res.status(200).send("data updated");
            }
          })
          .catch((error) => {
            console.error("Failed to update record : ", error);
            res.status(500).send(error.message);
          });
      })
      .catch((error) => {
        console.error("Failed to connect table : ", error);
        res.status(500).send(error.message);
      });
  } catch {
    console.error("Failed to update record : ", error);
    res.status(500).send(error.message);
  }
};

const logout = async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(400).send("User ID must be provided");
  }

  try {
    const user = await User.findOne({ where: { UserID: userId } });
    if (!user) {
      return res.status(404).send("No user found");
    }

    await user.update({ is_Online: false });

    const updatedUser = await User.findOne({ where: { UserID: userId } });
    console.log(
      "Successfully logged out. User is online:",
      updatedUser.is_Online
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error during logout: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const get_email_of_user_for_report = async (req, res) => {
  try {
    const Id = req.query.id;

    let emailRecord = await User.findOne({
      where: { UserID: Id },
      attributes: ["Email"],
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: Id },
        attributes: ["Email"],
      });
    }

    if (emailRecord) {
      res.send(emailRecord);
      console.log("-----------email", emailRecord);
    } else {
      res.status(404).send("Email not found for the given UserID");
    }
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};

const saveTheReportDataInModel = async (req, res) => {
  try {
    await Reports.create({
      Reported_Post_ID: req.body.post_id,
      postType: req.body.PostType,
      Reporter_email: req.body.Reporter_Email,
      reportjustification: req.body.ReportJustification,
      Reporttitle: req.body.report_tile,
    });

    await report_confirm_email(req.body.Reporter_Email);
    res
      .status(201)
      .send({ message: "Report successfully submitted and email sent." });
  } catch (error) {
    console.error("Failed to save report data: ", error);
    res.status(500).send({ message: "Failed to save report data" });
  }
};

const check_new_notification_or_not = async (req, res) => {
  const Id = req.query.id;

  console.log("-------------id coming from frontend is", Id);
  try {
    let emailRecord = await User.findOne({
      where: { UserID: Id },
      attributes: ["Email"],
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: Id },
        attributes: ["Email"],
      });
    }

    console.log("---------------email found is", emailRecord);

    const Email = emailRecord ? emailRecord.dataValues.Email : null;

    const status = await NotificationsOpenOrNot.findOne({
      where: { UserEmail: Email },
    });

    res.send(status.Notification_status);

    console.log(
      "----------------status sending to frontend is",
      status.Notification_status
    );
  } catch (error) {
    console.error("Error fetching status: ", error);
    res.status(500).send("Error fetching status");
  }
};

const fetchAllNotifications = async (req, res) => {
  const Id = req.query.id;
  console.log("-------------id coming from frontend is", Id);
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });

    let emailRecord = await User.findOne({
      where: { UserID: Id },
      attributes: ["Email"],
    });

    if (!emailRecord) {
      emailRecord = await Native.findOne({
        where: { UserID: Id },
        attributes: ["Email"],
      });
    }

    const Email = emailRecord ? emailRecord.dataValues.Email : null;

    await NotificationsOpenOrNot.update(
      { Notification_status: false },
      {
        where: { UserEmail: Email },
      }
    );

    console.log("------------------------------state turn into false");
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).send("Error fetching notifications");
  }
};

//--------------------------------------------------------------------------------------payment method

const paymentPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/payment_pics");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure file filter for image files
const paymentPicFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Set up Multer for image upload
const paymentPicUpload = multer({
  storage: paymentPicStorage,
  fileFilter: paymentPicFileFilter,
});

const Payment_from_user = async (req, res) => {
  try {
    await paymentPicUpload.single("Payment_Pic")(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err) {
        return res.status(500).send(err.message);
      }

      try {
        const newPayment = await Payment.create({
          // UserID: req.body.UserID,
          // ChatID: req.body.ChatID,
          // Email: req.body.Email,
          Amount: req.body.Amount,
          Last_four_digit_of_account: req.body.Last_four_digit_of_account,
          Payment_Pic: req.file.path,
          Payment_Method: req.body.Payment_Method,
          Date: req.body.Date,
          Time: req.body.Time,
        });

        console.log("Payment record created successfully!");
        res.send({
          message: "Payment record created successfully!",
          payment: newPayment,
        });
      } catch (error) {
        console.error("Failed to create payment record: ", error);
        res.status(500).send(error.message);
      }
    });
  } catch (error) {
    console.error("Failed to process payment data: ", error);
    res.status(500).send(error.message);
  }
};

//----------------------------------------------comments

const add_comment = async (req, res) => {
  try {
    await sequelize.sync();

    const CommenterUerID = req.body.UserID;
    const PostID = req.body.PostID;
    const UserComment = req.body.Comment;

    let CommentterName = await User.findOne({
      where: { UserID: CommenterUerID },
      attributes: ["Name"],
    });

    if (!CommentterName) {
      CommentterName = await Native.findOne({
        where: { UserID: CommenterUerID },
        attributes: ["Name"],
      });
    }

    const Name = CommentterName ? CommentterName.dataValues.Name : null;

    console.log("-----------------", Name);

    const commentdata = await Comment.create({
      CommenterName: Name,
      Comment: UserComment,
      PostId: PostID,
    });

    console.log(
      "--------------- data coming from frontend",
      CommenterUerID,
      PostID,
      UserComment
    );

    console.log("--------------data saving to DB", commentdata);

    res.send("comment uploaded");
  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const fetch_comment = async (req, res) => {
  try {
    const PostID = req.query.Post_ID;

    console.log(
      "-----------------------post id coming from frontend to fetch comments",
      PostID
    );

    await sequelize.sync();

    let CommentterName = await Comment.findAll({
      where: { PostId: PostID },
      order: [["createdAt", "DESC"]],
    });

    console.log("-----------------", CommentterName);

    res.send(CommentterName);
  } catch (error) {
    console.error("Error fetching comments: ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const chatgpt = async (req, res) => {
  try {
    const prompt = req.body.promptinput;

    // Create a Thread
    const thread = await openai.beta.threads.create();

    // Add a Message to the Thread with the user's prompt
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });

    // Run the Thread with the Assistant
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_2vwpWnGodEIrMbSQ8FS0TkYi",
    });

    // Poll the Run object for a terminal status
    while (["queued", "in_progress", "cancelling"].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    // Once the Run completes, list the Messages added to the Thread by the Assistant
    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      let assistantResponse = null;
      for (const message of messages.data) {
        if (message.role === "assistant") {
          // Assuming the first text block in each message is the assistant's response
          assistantResponse = message.content[0].text.value;
          break;
        }
      }

      // Send the response back to the client
      if (assistantResponse) {
        res.status(200).send({ response: assistantResponse });
      } else {
        res.status(404).send({ error: "No response from assistant." });
      }
    } else {
      res.status(500).send({ error: `Run status: ${run.status}` });
    }
  } catch (error) {
    console.error("Error during OpenAI interaction:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
};




// Chat controller to start a new chat session or retrieve an existing one
const startOrRetrieveChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Check if there's already a chat between these two users
    let chat = await Chatbox.findOne({
      where: {
        [Op.or]: [
          { sender_id: senderId, Receiver_Id: receiverId },
          { sender_id: receiverId, Receiver_Id: senderId }
        ]
      }
    });

    // If a chat does not exist, create a new one
    if (!chat) {
      chat = await Chatbox.create({
        sender_id: senderId,
        Receiver_Id: receiverId,
        message: ""  // Starting an empty message string, adjust as needed
      });
      res.status(201).send({ message: "New chat session started", chatId: chat.id });
    } else {
      res.status(200).send({ message: "Chat session retrieved", chatId: chat.id });
    }
  } catch (error) {
    console.error("Failed to start or retrieve chat:", error);
    res.status(500).send("Internal server error");
  }
};



// Function to send a message in a chat
const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    // Find or create a chat session between users
    let chat = await Chatbox.findOrCreate({
      where: {
        [Op.or]: [
          { sender_id: senderId, Receiver_Id: receiverId },
          { sender_id: receiverId, Receiver_Id: senderId }
        ]
      },
      defaults: { // Set defaults if creating a new chat session
        sender_id: senderId,
        Receiver_Id: receiverId,
        message: message  // Initialize with the first message
      }
    });

    // If chat already exists and not just created, update the message
    if (!chat[1]) {
      chat[0].message = message;
      await chat[0].save();
    }

    // Notify the sender that the message was sent successfully
    res.status(200).send({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal server error");
  }
};

// Function to receive messages from a chat
const receiveMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chatbox.findByPk(chatId);

    if (!chat) {
      return res.status(404).send({ message: "Chat not found" });
    }

    res.status(200).send({ message: chat.message });
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).send("Internal server error");
  }
};

const chatHistory = async (req, res) => {
  const { userId } = req.params;
  const senderId = req.query.sender_id;

  try {
    const messages = await Chatbox.findAll({
      where: {
        [Op.or]: [
          { sender_id: senderId, Receiver_Id: userId },
          { sender_id: userId, Receiver_Id: senderId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).send("Internal server error");
  }
};


const fetchAllChatsForUser = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a parameter

  try {
    const chats = await Chatbox.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { Receiver_Id: userId }]
      },
      order: [['createdAt', 'ASC']]
    });

    // You might want to fetch user details for each chat partner here if necessary
    res.json(chats);
  } catch (error) {
    console.error("Error retrieving chats for user:", error);
    res.status(500).send("Internal server error");
  }
};


const searchPosts = async (req, res) => {
  const searchTerm = req.query.q;  // Assuming the query parameter is named 'q'

  try {
      // Fetch users whose names match the search term
      let users = await User.findAll({
          where: {
              Name: { [Op.iLike]: `%${searchTerm}%` }  // Case insensitive search
          },
          attributes: ['UserID', 'Name', 'Profile_pic', 'Cover_photo']
      });

      // Extract user IDs
      let userIds = users.map(user => user.UserID);

      // Fetch posts by user ID or caption containing the search term
      const imagePosts = await Image_Post.findAll({
          where: {
              [Op.or]: [
                  { UserID: { [Op.in]: userIds } },
                  { img_caption: { [Op.iLike]: `%${searchTerm}%` } }
              ]
          }
      });

      const videoPosts = await Video_Post.findAll({
          where: {
              [Op.or]: [
                  { UserID: { [Op.in]: userIds } },
                  { Captions: { [Op.iLike]: `%${searchTerm}%` } }
              ]
          }
      });

      // If no user matches by name but posts are found by captions, fetch those users
      if (users.length === 0 && (imagePosts.length > 0 || videoPosts.length > 0)) {
          const postUserIDs = [...new Set([...imagePosts, ...videoPosts].map(post => post.UserID))];
          users = await User.findAll({
              where: { UserID: { [Op.in]: postUserIDs } },
              attributes: ['UserID', 'Name', 'Profile_pic', 'Cover_photo']
          });
      }

      // Manual joining of user details to posts
      const combinedPosts = [...imagePosts, ...videoPosts].map(post => {
          const user = users.find(u => u.UserID === post.UserID);
          return {
              ...post.dataValues,
              User: user ? {
                  Name: user.Name,
                  Profile_pic: user.Profile_pic,
                  Cover_photo: user.Cover_photo
              } : null
          };
      });

      // Sort combined posts by creation date
      combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Send response with users and their posts
      res.status(200).json({
          users,
          posts: combinedPosts
      });
  } catch (error) {
      console.error("Error in searchPosts: ", error.message);
      res.status(500).send("Internal Server Error");
  }
};



const searchUsersByName = async (req, res) => {
  try {
    const { name } = req.query;

    const users = await User.findAll({
      where: {
        Name: {
          [Op.iLike]: `%${name}%` // This assumes you're using PostgreSQL
        }
      },
      attributes: ["UserID", "Name", "Profile_pic", "is_Online"],
    });

    res.send(users);
  } catch (error) {
    console.error("Failed to search users: ", error);
    res.status(500).send("Failed to search users");
  }
};


module.exports = {
  signInUser,
  signUpUser,
  verifyUser,
  verify_forget_Password_email,
  verify_forgetpass,
  change_password,
  upload_video_Post,
  add_image_Post,
  allMedia,
  update_Profile,
  retrive_user_data,
  searchUsersByName,
  update_image_Post,
  update_video_Post,
  deleteImagePost,
  deleteVideoPost,
  get_imagePost_for_update,
  get_videoPost_for_update,
  searchPosts, 
  allusers,
  see_other_user_profile,
  logout,
  add_chats,
  check_chat_exist_or_not,
  allSocialMediaPosts,
  chatgpt,

  get_email_of_user_for_report,
  saveTheReportDataInModel,
  fetchAllNotifications,
  check_new_notification_or_not,
  Payment_from_user,
  add_comment,
  fetch_comment,
  Payment_via_card,


  startOrRetrieveChat,
  sendMessage,
  receiveMessage,
  chatHistory,
  fetchAllChatsForUser
  
};


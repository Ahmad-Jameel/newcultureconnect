const Native = require("../models/native.model");
const User = require("../models/user.model");
const sequelize = require("../config");
const jwtToken = require("jsonwebtoken");
const crypto = require('crypto');
const { sendVerificationEmail } = require('./nodemailer.emailservice');
const Image_Post = require("../models/imagePost.model")
const Video_Post = require("../models/videoPost.model")
const multer = require("multer");
const errorHandler = require("../utlis/errorhandandler")
const { Op } = require('sequelize');
const Chatbox = require("../models/chatbox.model")

const Blogs = require("../models/blogs.model");
const NotificationsOpenOrNot = require("../models/notfication_open_or_not")
const ReportofNative = require("../models/native.report.model")
const Rating = require("../models/rating.model")

const { OpenAI } = require('openai');
require('dotenv').config();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const chatgpt = async (req, res) => {
  try {
    const prompt = req.body.promptinput;
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });

    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_2vwpWnGodEIrMbSQ8FS0TkYi" 
    });
    
    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }
    
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      let assistantResponse = null;
      for (const message of messages.data) {
        if (message.role === "assistant") {
          assistantResponse = message.content[0].text.value;
          break;
        }
      }
      
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
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
};



const allSocialMediaPosts = async (req, res) => {
  try {
    await sequelize.sync();

    const excludedUserId = req.query.id; 

    const AllUsersID = await Native.findAll({
      where: {
        UserID: { [Op.ne]: excludedUserId }
      },
      attributes: ['UserID']
    });

    const AllUsersIDs = [...new Set(AllUsersID.map(entry => entry.UserID))];


    console.log(AllUsersIDs)

    const Userphoto = await Native.findAll({ where: { UserID: { [Op.in]: AllUsersIDs } } });
    const images = await Image_Post.findAll({  where: { UserID: { [Op.in]: AllUsersIDs } } });
    const videos = await Video_Post.findAll({ where: { UserID: { [Op.in]: AllUsersIDs } } });


    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    console.log("Media fetched and sorted successfully.");
    res.status(200).send({Userphoto, combinedMedia});

  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send('Internal Server Error');
  }
};

const check_chat_exist_or_not = async (req, res) => {
  const senderId = req.query.sender_id; 
  const receiverId = req.query.id; 

  console.log( "==============================",{ senderId, receiverId });

  try {
    const existingChat = await Chatbox.findOne({
      where: {
        sender_id: senderId,
        Receiver_Id: receiverId, 
      }
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
    await sequelize.sync();

    const senderId = req.query.sender_id; 

    const userId = await Chatbox.findAll({
      attributes: ['Receiver_Id'], 
      where: {
        sender_id: senderId 
      }
    });
    console.log("-------------------------------",userId)
    const receiverIds = [...new Set(userId.map(entry => entry.Receiver_Id))];

    // Fetch user details for all receiver IDs
    const users = await Native.findAll({
      where: { UserID: { [Op.in]: receiverIds } },
      attributes: ['UserID', 'Name', 'Profile_pic']
    });

    const previousChats = await Chatbox.findAll({
      where: {
        [Op.or]: [
          { sender_id: senderId},
        ]
      },
      order: [['createdAt', 'ASC']] 
    });

    console.log("User photo:", users);

    

    res.status(200).send({ users, previousChats });

  } catch (error) {
    console.error("Error in operation: ", error.message);
    res.status(500).send('Internal Server Error');
  }
}





const My_native_all_blogs = async (req, res) => {
  try {
    const excludedUserId = req.query.id;

    const user = await Native.findOne({
      where: {
        UserID: excludedUserId
      },
      attributes: ['UserID']
    });
    const users = await Blogs.findAll({ where: { UserID: user.UserID }});
    res.send(users);
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};


const see_other_user_profile = async (req, res) => {
  try {
    await sequelize.sync();



    const Userphoto = await User.findOne({ where: { UserID: req.query.id }, attributes: ['UserID', 'Name', 'Profile_pic', 'Cover_photo'] });
    const images = await Image_Post.findAll({ where: { UserID: req.query.id } });
    const videos = await Video_Post.findAll({ where: { UserID: req.query.id } });

    console.log("-----------", Userphoto)


    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    console.log("Media fetched and sorted successfully.", combinedMedia);
    res.status(200).send({Userphoto, combinedMedia});

  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send('Internal Server Error');
  }
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
  }
});

const image_fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const image_upload = multer({ 
  storage: image_storage,
  fileFilter: image_fileFilter
});



const video_storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads/videos");
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const video_fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(gif|GIF|mp4|MP4|mov|MOV)$/)) {
      req.fileValidationError = 'Only video files are allowed!';
      return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};

const add_video_post = multer({ 
  storage: video_storage,
  fileFilter: video_fileFilter
});


const Blog_image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/Blog_images'); 
  },
  filename: function (req, file, cb) {
    // Use Date.now() to get a unique timestamp for the filename
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Set up file filter to check for image files
const Blog_image_fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(gif|GIF|jpg|jpeg|png)$/i)) {
    req.fileValidationError = 'Only image files are allowed!';
    cb(new Error('Only image files are allowed!'), false);
  } else {
    cb(null, true);
  }
};

// Configure multer to use the storage and file filter
const Blog_image_upload = multer({ 
  storage: Blog_image_storage,
  fileFilter: Blog_image_fileFilter
});




//------------retrive user data for update profile---------
const retrive_user_data = async (req, res) => {
  try {
    await sequelize.sync();

    console.log(req.query.id);

    // Use findOne to get a single user object
    const user = await Native.findOne({ where: { UserID: req.query.id } });

    if (!user) {
      return res.status(404).send('No user found');
    }

    console.log("User data displayed");
    res.status(200).send(user); // Send the user object directly

  } catch (error) {
    console.error("Error fetching user data: ", error.message);
    res.status(500).send('Internal Server Error');
  }
};





//------------UPDATE PROFILE------------
const update_Profile = async (req, res) => {
  image_upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'profile_image', maxCount: 1 }])(req, res, async (err) => {
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    }
    if (err) {
        return res.status(500).send(err.message);
    }

    try {
      // Determine paths for cover and profile images
      const coverImagePath = req.files['cover_image'] ? req.files['cover_image'][0].path : null;
      const profileImagePath = req.files['profile_image'] ? req.files['profile_image'][0].path : null;

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
      const [updatedRows] = await Native.update(updateData, { where: { UserID: req.body.id } });
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




//-------RETRIVE ALL MEDIA DATA----------
const allMedia = async (req, res) => {
  try {
    await sequelize.sync();

    const Userphoto = await Native.findAll({ where: { UserID: req.query.id } });
    const images = await Image_Post.findAll({ where: { UserID: req.query.id } });
    const videos = await Video_Post.findAll({ where: { UserID: req.query.id } });


    const combinedMedia = images.concat(videos);

    if (images.length === 0 && videos.length === 0) {
      console.log("No images or videos found for the given user ID.");
      return res.status(200).send({ Userphoto, combinedMedia: [] });
    }

    combinedMedia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    console.log("Media fetched and sorted successfully.");
    res.status(200).send({Userphoto, combinedMedia});

  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send('Internal Server Error');
  }
};


//------
//----------IMAGE-----------

const update_image_Post = async (req, res) => {
  try {
    await image_upload.single('image')(req, res, async (err) => {
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

        await Image_Post.update({
          picture: imagePath,
          img_caption: req.body.caption
        }, {
          where: {
            id: req.body.id
          }
        });

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
    await image_upload.single('image')(req, res, async (err) => {
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
          img_caption: req.body.caption
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

//---------------------VIDEO-------------------------

const update_video_Post = async (req, res) => {
  try {
    await add_video_post.single('video')(req, res, async (err) => {
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

        await Video_Post.update({
          Video: videoPath,
          Captions: req.body.caption
        }, {
          where: {
            id: req.body.id
          }
        });

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
    await add_video_post.single('video')(req, res, async (err) => {
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
          UserID: req.body.id 
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
const signUpNative= async (req, res) => {
    try {
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        
        temporaryUsers[verificationCode] = {
          FirstName: req.body.fname,
          LastName: req.body.lname,
          Name: req.body.name,
          Email: req.body.email,
          Password: req.body.pass,
          PhoneNumber: req.body.pnum,
          city:req.body.city,
          province:req.body.province,
          language:req.body.language,
          service:req.body.service,
          qualification:req.body.qualification,
          Feild_qualification:req.body.feild_qualification
        };

        console.log(temporaryUsers);

        await sendVerificationEmail(req.body.email, verificationCode);
        res.send('Verification code sent to email.');
    } catch (error) {
        console.error("Error in signUpUser: ", error);
        res.status(500).send(error.message);
    }
};

const verifyUser = async (req, res) => {
    
  try {
      console.log('Received verification code:', req.body.verificationCode);
        const { verificationCode } = req.body;
        console.log(temporaryUsers);
        const tempUser = temporaryUsers[verificationCode];
        console.log(tempUser);

        if (!tempUser) {
            return res.status(400).send('Invalid verification code');
        }

        const newUser = await Native.create({
            ...tempUser,
            role: "native",
            isVerified: true
        });

        await NotificationsOpenOrNot.create({
          UserEmail: tempUser.Email
        })

        delete temporaryUsers[verificationCode];

        res.send('User verified and registered successfully');
        console.log("-----------registered");
    } catch (error) {
        console.error("Error in verifyUser: ", error);
        res.status(500).send(error.message);
    }
};

const signInUser = async (req, res) => {
  try {
    await sequelize.sync();
    const user = await Native.findOne({
      where: {
        Password: req.body.pass,
        Email: req.body.email,
      }
    });

    if (!user) {
      console.error("Invalid Credentials!");
      res.status(401).send("Invalid Credentials");
    } else {
      user.is_Online = true;
      await user.save();
      const token = jwtToken.sign({ role: "native" }, 'cvbnm');

      const user_ID = await Native.findOne({
        attributes: ['UserID', 'role'],
        where: {
          Email: req.body.email
        }
      });

      console.log(user);

      res.status(200).send({
        user_ID,
        roles: token.Role,
        accessToken: token
      });
    }
  } catch (error) {
    console.error("Failed to sign in token not created: ", error);
    res.status(500).send(error.message);
  }
};

//------------------forget password-----------------
let temp_forget_pass = 0;
  let temp_forgetpass_email = "";
  const verify_forget_Password_email = async (req, res) => {
    try {
        await sequelize.sync();

        const user = await Native.findOne({
            where: {
                Email: req.body.email,
            }
        });

        if (user) {
            const forgetpass_verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
            await sendVerificationEmail(req.body.email, forgetpass_verificationCode);
            res.send("Verification code sent to your email")
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
        return res.status(400).send('Invalid verification code');
    }

    isVerified = true;
    res.send('User verified. You can now change your password.');
  } catch (error) {
      console.error("Error in verifyUser: ", error);
      res.status(500).send(error.message);
  }
};

const change_password = async(req, res) => {
  try{

    if (!isVerified) {
      return res.status(403).send('canot update the password');
    }

    await sequelize
    .sync()
    .then(async() => {
     await Native.update(
        {
          Password: req.body.pass,
        },
        {
          where: { Email: temp_forgetpass_email }
        }
      )
        .then((data) => {
          if(!data)
          {
            res.send(new errorHandler("Email do not exist " , 404))
          }
          else{
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
  }catch{
    console.error("Failed to update record : ", error);
    res.status(500).send(error.message);
  }
};


//-----------------------------------------------------------------------------------------------------BLOGS-------------------------------------
const add_blogs = async (req, res) => {
  try {

    console.log(req.body)
    console.log(req.files)
    await Blog_image_upload.fields([
      { name: 'Blog_Content_Image', maxCount: 1 },
      { name: 'Blog_Title_Image', maxCount: 1 }
    ])(req, res, async (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err) {
        return res.status(500).send("------",err.message);
      }

      try {
        await sequelize.sync();
        console.log("Images table synced successfully!");

        const dtaafromfrontend = await Blogs.create({
          UserID: req.body.UserID,
          Blog_Title: req.body.BlogTitle,
          Blog_Content: req.body.blogContent,
          Blog_Title_Image: req.files['Blog_Title_Image'][0].path, 
          Blog_Content_Image: req.files['Blog_Content_Image'][0].path, 
        });

        console.log("Blog entry added successfully.", dtaafromfrontend);
        res.send("Successfully added records of blogs");
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


//--------------------------------------------------update this
const see_specific_blog = async (req, res) => {
  try {
    await sequelize.sync();
    
    const Blogdata = await Blogs.findAll({ where: { id: req.query.id } });

    const AllUsersIDs = [...new Set(Blogdata.map(entry => entry.UserID))];

    console.log(AllUsersIDs)

    const BlogUserData = await Native.findAll({ where: { UserID: { [Op.in]: AllUsersIDs } } });


    console.log("Media fetched and sorted successfully.");
    res.status(200).send({BlogUserData, Blogdata });
    

  } catch (error) {
    console.error(error); // This should print the full error stack trace.
    res.status(500).send('Internal Server Error');
  }
};


const allblogs = async (req, res) => {
  try {

    const users = await Blogs.findAll();

    
    res.send(users);
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};


const searchBlogsByVoiceCommand = async (req, res) => {
  try {
    const { voiceCommand } = req.query;

    if (!voiceCommand) {
      return res.status(400).send('Voice command is required.');
    }

    // Split the voice command into individual words
    const keywords = voiceCommand.split(" ");

    // Build the query to search for blogs
    const query = {
      where: {
        [Op.or]: [
          // Convert both Blog_Title and Blog_Content to lowercase and check for a match
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Blog_Title')), {
            [Op.like]: `%${voiceCommand.toLowerCase()}%`
          }),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Blog_Content')), {
            [Op.like]: `%${voiceCommand.toLowerCase()}%`
          })
        ],
      },
    };

    // Fetch blogs based on the query
    const blogs = await Blogs.findAll(query);

    res.send(blogs);
  } catch (error) {
    console.error("Failed to retrieve blogs: ", error);
    res.status(500).send("Failed to retrieve blogs");
  }
};

//---------get sepecific social post data---------

const get_imagePost_for_update = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      Image_Post.findOne({
        where: {
          id: req.body.id
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
          id: req.body.id
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




//-------------------------------------------------------------------see all natives profiles for blogs
// const all_natives_profile_for_service = async (req, res) => {
//   try {

//     const users = await Native.findAll();

//     res.send(users);
//   } catch (error) {
//     console.error("Failed to retrieve data: ", error);
//     res.status(500).send("Failed to retrieve data");
//   }
// };



const all_natives_profile_for_service = async (req, res) => {
  try {
    const currentUserId = req.query.userId;

    // Check if the current user is in the users table
    const user = await User.findOne({ where: { UserID: currentUserId } });

    let natives;
    if (user) {
      // If the user is in the users table, send all native profiles
      natives = await Native.findAll();
    } else {
      // If the user is in the natives table, exclude the current user from the native profiles
      natives = await Native.findAll({
        where: {
          UserID: {
            [Op.ne]: currentUserId,
          },
        },
      });
    }

    res.send(natives);
  } catch (error) {
    console.error("Failed to retrieve data: ", error);
    res.status(500).send("Failed to retrieve data");
  }
};





const see_Native_profile = async (req, res) => {
  try {
    await sequelize.sync();

    const Userphoto = await Native.findOne({ where: { UserID: req.query.id }});

    console.log("-----------", Userphoto)

    res.status(200).send({Userphoto});

  } catch (error) {
    console.error("Error fetching media: ", error.message);
    res.status(500).send('Internal Server Error');
  }


};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.body;

    await Blogs.destroy({ where: { BlogsID: id } });
    res.status(200).send("Blog deleted successfully");
  } catch (error) {
    console.error("Failed to delete blog: ", error);
    res.status(500).send("Failed to delete blog");
  }
};



const get_blog_details = async (req, res) => {
  const blogId = req.params.id;  // Assume the ID is passed as a URL parameter

  try {
      const blog = await Blogs.findOne({
          where: { BlogsID: blogId }
      });

      if (blog) {
          res.json(blog);  // Send the blog data as JSON
      } else {
          res.status(404).send('Blog not found');
      }
  } catch (error) {
      console.error("Failed to retrieve blog details:", error);
      res.status(500).send(error.message);
  }
};


const update_blog = async (req, res) => {
  const blogId = req.params.id;  // Assume the ID is passed as a URL parameter

  try {
      await Blog_image_upload.fields([
          { name: 'Blog_Title_Image', maxCount: 1 },
          { name: 'Blog_Content_Image', maxCount: 1 }
      ])(req, res, async (err) => {
          if (err) {
              return res.status(500).send(err.message);
          }

          const { BlogTitle, blogContent, UserID } = req.body;
          const updateValues = {
              UserID: UserID,
              Blog_Title: BlogTitle,
              Blog_Content: blogContent
          };

          // Update image paths only if new images are uploaded
          if (req.files['Blog_Title_Image']) {
              updateValues.Blog_Title_Image = req.files['Blog_Title_Image'][0].path;
          }
          if (req.files['Blog_Content_Image']) {
              updateValues.Blog_Content_Image = req.files['Blog_Content_Image'][0].path;
          }

          try {
              const result = await Blogs.update(updateValues, {
                  where: { BlogsID: blogId }
              });
              if (result == 0) {
                  return res.status(404).send('Blog not found');
              }
              res.send('Blog updated successfully');
          } catch (updateError) {
              console.error("Error updating the blog:", updateError);
              res.status(500).send(updateError.message);
          }
      });
  } catch (error) {
      console.error("Error processing update:", error);
      res.status(500).send(error.message);
  }
};



const search_natives = async (req, res) => {
  try {
    const query = req.query.query;

    const natives = await Native.findAll({
      where: {
        [Op.or]: [
          { Name: { [Op.like]: `%${query}%` } },
          { service: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.send(natives);
  } catch (error) {
    console.error("Failed to search native profiles: ", error);
    res.status(500).send("Failed to search native profiles");
  }
};



const report_native = async (req, res) => {
  try {
    const { nativeId, reporterId, reason } = req.body;

    // Check if a report from this reporter for this native already exists
    let report = await ReportofNative.findOne({ where: { nativeId, reporterId } });

    if (report) {
      // If the report already exists, send a message indicating so
      res.status(400).send("You have already reported this native.");
    } else {
      // If the report does not exist, create a new one
      report = await ReportofNative.create({
        nativeId,
        reporterId,
        reason,
        count: 1, // Initialize count to 1 for the new report
      });

      res.status(201).send(report);
    }
  } catch (error) {
    console.error("Failed to report native: ", error);
    res.status(500).send("Failed to report native");
  }
};


const rate_native = async (req, res) => {
  try {
    const { nativeId, userId, rating } = req.body;

    // Check if a rating from this user for this native already exists
    let userRating = await Rating.findOne({ where: { nativeId, userId } });

    if (userRating) {
      return res.status(400).send("You have already given rating native."); // Ensure we return early to avoid sending another response
    } 

    // Create a new rating
    userRating = await Rating.create({
      nativeId,
      userId,
      rating,
    });

    res.status(201).send(userRating);
  } catch (error) {
    console.error("Failed to rate native: ", error);
    res.status(500).send("Failed to rate native");
  }
};


const get_average_ratings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      attributes: [
        'nativeId',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      group: ['nativeId']
    });


    console.log("=====================rating sof natives", ratings);
    res.status(200).send(ratings);
  } catch (error) {
    console.error("Failed to fetch average ratings: ", error);
    res.status(500).send("Failed to fetch average ratings");
  }
};


module.exports = {
    signInUser,
    signUpNative,
    verifyUser,
    chatgpt,
    deleteBlog,
    verify_forget_Password_email,
    verify_forgetpass,
    change_password,


    upload_video_Post,
    add_image_Post,
    allMedia,
    update_Profile,
    retrive_user_data,

    update_image_Post,
    update_video_Post,
    deleteImagePost,
    deleteVideoPost,
    get_imagePost_for_update,
    get_videoPost_for_update,


    My_native_all_blogs,
    see_other_user_profile,
    //logout,
    add_chats,
    check_chat_exist_or_not,
    allSocialMediaPosts,
    //----------------------add blogs
    add_blogs,
    see_specific_blog,
    allblogs,
    all_natives_profile_for_service,
    see_Native_profile,


    searchBlogsByVoiceCommand,
    get_blog_details,
    update_blog,
    search_natives,
    report_native,
    rate_native,
    get_average_ratings
};
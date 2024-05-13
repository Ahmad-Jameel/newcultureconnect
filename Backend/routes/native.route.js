const express = require('express')
const router = express.Router()
const check = require("../midlleware/checkDuplicates")
const fuction = require('../controllers/native_controller')
const {isUser} = require('../midlleware/jwtauthenticate')

router.post('/signUpNative' , check , fuction.signUpNative);
router.post('/signIn' , fuction.signInUser);
router.post('/verify', fuction.verifyUser); 
router.post("/gpt", fuction.chatgpt)

router.post('/forgetpassword', fuction.verify_forget_Password_email);
router.post('/verify_forgetpassword', fuction.verify_forgetpass);
router.post('/changepassword', fuction.change_password)
router.get('/socialdata', fuction.allMedia)

router.post('/add_videopost', fuction.upload_video_Post)
router.post('/add_imagepost', fuction.add_image_Post)

router.put('/upadte_userprofile', fuction.update_Profile)
router.get('/display_userdatafior_update', fuction.retrive_user_data)
router.put("/Update_video_post", fuction.update_video_Post)
router.put('/update_image_post', fuction.update_image_Post)
router.delete('/deleteVideoPost', fuction.deleteVideoPost)
router.delete('/deleteImagePost', fuction.deleteImagePost)
router.get('/getvideoPostforupdate', fuction.get_videoPost_for_update)
router.get('/getimagePostforupdate', fuction.get_imagePost_for_update)

router.post('/addblogs', fuction.add_blogs)
router.get("/see_specific_blog", fuction.see_specific_blog)
router.get("/allblogs", fuction.allblogs)
router.get("/all_native_profile_for_service", fuction.all_natives_profile_for_service)
router.get("/see_native_profile", fuction.see_Native_profile)
router.get("/my_blogs", fuction.My_native_all_blogs)

router.get('/see_other_user_profile', fuction.see_other_user_profile)


// //--------for_social_post--------------
// 

// router.get('/allusers_in_plateform', fuction.allusers)

// router.put('/logout', fuction.logout)

// router.get("/check_chat_box", fuction.check_chat_exist_or_not)
// router.get("/chatbox", fuction.add_chats)

// router.get("/allsocialmediaposts", fuction.allSocialMediaPosts)

router.get('*', function(req, res){
    res.status(404).send('404 error: page not found');
  });

module.exports = router
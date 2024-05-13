const express = require('express')
const router = express.Router()
const check = require("../midlleware/checkDuplicates")
const fuction = require('../controllers/user.controller')
const {isUser} = require('../midlleware/jwtauthenticate')

router.post('/signUpUser' , check , fuction.signUpUser);
router.post('/signIn' , fuction.signInUser);
router.post('/verify', fuction.verifyUser); 
router.post('/forgetpassword', fuction.verify_forget_Password_email);
router.post('/verify_forgetpassword', fuction.verify_forgetpass);
router.post('/changepassword', fuction.change_password)

//--------for_social_post--------------
router.post('/add_videopost', fuction.upload_video_Post)
router.post('/add_imagepost', fuction.add_image_Post)
router.get('/socialdata', fuction.allMedia)
router.put('/upadte_userprofile', fuction.update_Profile)
router.get('/display_userdatafior_update', fuction.retrive_user_data)
router.put("/Update_video_post", fuction.update_video_Post)
router.put('/update_image_post', fuction.update_image_Post)
router.delete('/deleteVideoPost', fuction.deleteVideoPost)
router.delete('/deleteImagePost', fuction.deleteImagePost)
router.get('/getvideoPostforupdate', fuction.get_videoPost_for_update)
router.get('/getimagePostforupdate', fuction.get_imagePost_for_update)


router.get('/allusers_in_plateform', fuction.allusers)
router.get('/see_other_user_profile', fuction.see_other_user_profile)
router.put('/logout', fuction.logout)

router.get("/check_chat_box", fuction.check_chat_exist_or_not)
router.get("/chatbox", fuction.add_chats)

router.get("/allsocialmediaposts", fuction.allSocialMediaPosts)
router.post("/gpt", fuction.chatgpt)

router.get("/get_email_of_reporter", fuction.get_email_of_user_for_report)
router.post("/submit_report", fuction.saveTheReportDataInModel)


router.get ("/getallnotification", fuction.fetchAllNotifications)
router.get ("/check_notification_state", fuction.check_new_notification_or_not)


router.post("/payment_by_user", fuction.Payment_from_user)
router.post("/Add_Comment", fuction.add_comment)
router.get('/fetch_all_comments', fuction.fetch_comment)
router.post("/payment_with_card", fuction.Payment_via_card)


router.post("/start_chat", fuction.startOrRetrieveChat);
router.post("/send_message", fuction.sendMessage);
router.get("/receive_message", fuction.receiveMessage);
router.get("/chat_history/:userId", fuction.chatHistory);
router.get("/user/chats/:userId", fuction.fetchAllChatsForUser);

router.get('*', function(req, res){
    res.status(404).send('404 error: page not found');
  });

module.exports = router
const express = require('express')
const router = express.Router()
const fuction = require('../controllers/admin.controller')
const {isAdmin} = require('../midlleware/jwtauthenticate')

router.get('/fetch_all_reports', fuction.fetch_all_reports);
router.get("/get_reported_user_post_by_id", fuction.search_post_by_id)
router.delete("/deletepost", fuction.Delete_post)
router.post("/report_query_update", fuction.update_reporter_query)
router.post("/add_ads", fuction.add_ads)
router.get("/display_ad", fuction.display_add)
router.post("/addNotification", fuction.saveNotificationData)
router.get("/getAllPaymentData", fuction.fetchAllPaymentData)
router.post("/paymentConfirmation", fuction.paymentConfirmation)

router.post("/loginAdmin", fuction.signInAdmin)
router.post("/signup", fuction.Signup)


router.get('*', function(req, res){
    res.status(404).send('404 error: page not found');
  });

module.exports = router
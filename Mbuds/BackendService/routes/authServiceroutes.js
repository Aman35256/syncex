const express = require('express');
const router = express.Router();
const authController = require('../controllers/authService');

router.get('/moodbudsv1/signup', authController.getmoodbudsSignup);
router.post('/moodbudsv1/signup', authController.postmoodbudssignup);
router.get('/moodbudsv1/verifyotp', authController.getverifyotp);
router.post('/moodbudsv1/verifyotp', authController.postverifyotp);
router.get('/moodbudsv1/profilecreation', authController.getProfileCreation);
router.post('/moodbudsv1/profilecreation', authController.postProfileCreation);
router.get('/moodbudsv1/signin', authController.getmoodBudsSignin);
router.post('/moodbudsv1/signin', authController.postmoodBudsSignin);

// Temporary compatibility alias for clients using the old spelling.
router.post('/moodbudsv1/singin', authController.postmoodBudsSignin);

module.exports = router;


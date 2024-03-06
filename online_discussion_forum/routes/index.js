const express = require('express');
const signup_controller = require('../controllers/signupController');

const router = express.Router();



/* GET home page. */
router.get('/', signup_controller.home_page);

router.get('/signup', function(req, res, next) {

});

/* POST signup page*/ 
router.post('/signup', (req, res, next) => {
  
});

module.exports = router;

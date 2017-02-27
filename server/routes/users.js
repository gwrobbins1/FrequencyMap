var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/api/users', function(req, res, next) {
  // res.send('respond with a resource');

  res.json({
  	users:[
  		{_id: 1,name: 'test1'},
  		{_id: 2,name: 'test2'},
  		{_id: 3,name: 'test3'}
  	]
  });
});

module.exports = router;

const express = require('express');
const {handleGenerateShortUrl, handleRedirect, handleGetAnalytics} = require('../controller/url');                 
const router = express.Router();

router.post('/', handleGenerateShortUrl);
router.get('/:shortId', handleRedirect);
router.get('/analytics/:shortId', handleGetAnalytics);


module.exports = router;
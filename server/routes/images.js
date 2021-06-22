const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get request for a question with a default page of 1
router.get('/', (req, res) => {
  res.status(200).send([]);
});

module.exports.router = router;

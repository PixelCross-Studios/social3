const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get request for a question with a default page of 1
router.get('/questions', (req, res) => {
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/qa/questions', {
    headers: {
      Authorization: GITHUB_API_KEY
    },
    params: {
      product_id: req.query.product_id,
      page: req.query.page || 1
    }
  })
    .then((response) => response.data)
    .then((questions) => {
      res.send(questions);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err);
    });
});

// Post request for a new question
router.post('/questions', (req, res) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/qa/questions', {
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
    product_id: req.body.product_id
  }, {
    headers: {
      Authorization: GITHUB_API_KEY
    }
  })
    .then((response) => {
      res.status(201).send(response.data);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err);
    });
});

// Update the helpfulness of a question
router.put('/questions/helpful', (req, res) => {
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/qa/questions/${req.query.question_id}/helpful`, {}, {
    headers: {
      Authorization: GITHUB_API_KEY
    }
  })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err);
    });
});

module.exports.router = router;

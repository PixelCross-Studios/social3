import axios from 'axios';

/**
 * An object that stores information about a question
 * @typedef {Object} Answer
 * @property {number} answer_id
 * @property {string} body
 * @property {number} helpfulness
 * @property {boolean} reported
 * @property {string} answerer_name
 * @property {Date} date
 * @property {Array<string>} photos
 */

/**
 * An object that stores information about a question
 * @typedef {Object} Question
 * @property {number} question_id
 * @property {string} question_body
 * @property {number} question_helpfulness
 * @property {boolean} reported
 * @property {string} asker_name
 * @property {Date} question_date
 * @property {Object.<number, Answer>} answers
 */

/**
 * Gets a list of questions for a product (separated by pages)
 * @param {string} productId
 * @param {number} page
 * @returns {Promise<Array<Question>>} A promise that resolves to an array of
 * questions if the request is successful
 */
export function getQuestions(productId, page) {
  return axios.get('/api/qa/questions', {
    params: {
      product_id: productId,
      page
    }
  }).then((response) => response.data);
}

/**
 * Creates a question using a question object
 * @param {Object} question should contain productId, body, name, and email
 * @returns {Promise<string>} A promise that resolves to 'Created' if successful
 */
export function createQuestion(question) {
  return axios.post('/api/qa/questions', {
    product_id: question.productId,
    body: question.body,
    name: question.name,
    email: question.email
  }).then((response) => response.data);
}

/**
 * Marks a question as helpful
 * @param {number} questionId is the id of the question to be marked
 * @returns {Promise} A promise that resolves to '' if successful
 */
export function markQuestionHelpful(questionId) {
  return axios.put('/api/qa/questions/helpful', {}, {
    params: {
      question_id: questionId
    }
  }).then((response) => response.data);
}

/**
 * Marks a question as reported
 * @param {number} questionId is the id of the question to be marked
 * @returns {Promise} A promise that resolves to '' if successful
 */
export function reportQuestion(questionId) {
  return axios.put('/api/qa/questions/report', {}, {
    params: {
      question_id: questionId
    }
  }).then((response) => response.data);
}

/**
 * Gets a list of answers for a product (separated by pages)
 * @param {string} questionId
 * @param {number} page
 * @returns {Promise<Array<Answer>>} A promise that resolves to an array of
 * answers if the request is successful
 */
export function getAnswers(questionId, page) {
  return axios.get('/api/qa/answers', {
    params: {
      question_id: questionId,
      page
    }
  }).then((response) => response.data);
}

/**
 * Creates a answer using a answer object
 * @param {Object} answer should contain productId, body, name, and email
 * @returns {Promise<string>} A promise that resolves to 'Created' if successful
 */
export function createAnswer(answer) {
  return axios.post('/api/qa/answers', {
    product_id: answer.productId,
    body: answer.body,
    name: answer.name,
    email: answer.email
  }, {
    params: {
      question_id: answer.questionId
    }
  }).then((response) => response.data);
}

/**
 * Marks an answer as helpful
 * @param {number} answerId is the id of the answer to be marked
 * @returns {Promise} A promise that resolves to '' if successful
 */
export function markAnswerHelpful(answerId) {
  return axios.put('/api/qa/answers/helpful', {}, {
    params: {
      answer_id: answerId
    }
  }).then((response) => response.data);
}

/**
 * Marks an answer as reported
 * @param {number} answerId is the id of the answer to be marked
 * @returns {Promise} A promise that resolves to '' if successful
 */
export function reportAnswer(answerId) {
  return axios.put('/api/qa/answers/report', {}, {
    params: {
      answer_id: answerId
    }
  }).then((response) => response.data);
}

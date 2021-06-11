import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid, Typography, Button
} from '@material-ui/core';

import AnswerItem from './AnswerItem.jsx';

export default function AnswerList({ answers }) {
  return (
    <Grid container justify="flex-start">
      <Grid item style={{ margin: '0px 5px 0px 0px' }}>
        <Typography className="answerList">A:</Typography>
      </Grid>
      <Grid item xs={11}>
        {answers.map((answer) => <AnswerItem key={answer.answer_id} answer={answer} />)}
        <Button type="button" className="moreAnswers">LOAD MORE ANSWERS</Button>
      </Grid>
    </Grid>
  );
}

AnswerList.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.object)
};

AnswerList.defaultProps = {
  answers: []
};

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  TextField,
  Button
} from '@material-ui/core';

import { AppContext } from '../../../helpers/context';

function getModalStyle() {
  const top = 25;
  // const left = 50;

  return {
    top: `${top}%`,
    margin: '0px 100px'
    // left: `${left}%`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function AnswerModalBody({ question }) {
  const { product } = useContext(AppContext);

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Container style={modalStyle} className={classes.paper}>
      <Typography className="title">Submit your Answer</Typography>
      <Typography className="subtitle">{`${product.name}: ${question.question_body}`}</Typography>
      <form className="formContainer">
        <TextField
          multiline
          rows={6}
          variant="outlined"
          label="Answer"
          placeholder="Example: jackson11!"
          helperText="For privacy reasons, do not use your full name or email address"
          className="answer"
        />

        <TextField
          variant="outlined"
          label="Nickname"
          placeholder="Example: jack543!"
          helperText="For privacy reasons, do not use your full name or email address"
          className="nickname"
        />

        <TextField
          variant="outlined"
          label="Nickname"
          placeholder="Example: jack@email.com"
          helperText="For authentication reasons, you will not be emailed"
          type="email"
          className="email"
        />

        <Button
          variant="contained"
          component="label"
        >
          Upload Photo
          <input
            type="file"
            hidden
          />
        </Button>

        <Button variant="contained" type="button">Submit</Button>
      </form>
    </Container>
  );
}

AnswerModalBody.propTypes = {
  question: PropTypes.shape({
    question_id: PropTypes.number,
    question_body: PropTypes.string,
    question_helpfulness: PropTypes.number,
    asker_name: PropTypes.string
  })
};

AnswerModalBody.defaultProps = {
  question: {}
};

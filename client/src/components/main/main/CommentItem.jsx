import React from 'react';
import PropTypes from 'prop-types';

import {
  Container, Typography
} from '@material-ui/core';

import useStyles from '../styles';

export default function CommentItem({ comment }) {
  const classes = useStyles();

  function formatDate(date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  return (
    <Container style={{ padding: 0 }}>
      <Typography className="text">{comment.body}</Typography>
      <Typography
        className={classes.commentInfo}
        variant="body2"
      >
        {`by ${comment.username}, ${formatDate(new Date(comment.createdAt))}`}
      </Typography>
    </Container>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    body: PropTypes.string,
    rating: PropTypes.number,
    username: PropTypes.string,
    createdAt: PropTypes.string
  })
};

CommentItem.defaultProps = {
  comment: {}
};

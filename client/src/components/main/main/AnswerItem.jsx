import React from 'react';
import PropTypes from 'prop-types';

import {
  Container, Grid, Typography, Button
} from '@material-ui/core';

import ImageModal from '../modals/ImageModal.jsx';

export default function AnswerItem({ answer }) {
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
      <Typography className="text">{answer.body}</Typography>
      <Grid container>
        {answer.photos.map((photo) => <ImageModal key={photo.id} url={photo.url} />)}
      </Grid>
      <Grid container direction="row" alignItems="baseline">
        <Typography
          className="user"
          variant="body2"
          style={{ borderRight: '1px solid #555' }}
        >
          {`by ${answer.answerer_name}, ${formatDate(new Date(answer.date))}`}
        </Typography>
        <Typography variant="body2">
          Helpful?
        </Typography>
        <Button type="button">Yes</Button>
        <Typography variant="body2" style={{ borderRight: '1px solid #555' }}>
          {`(${answer.helpfulness})`}
        </Typography>
        <Button className="addAnswer">Report</Button>
      </Grid>
    </Container>
  );
}

AnswerItem.propTypes = {
  answer: PropTypes.shape({
    answer_id: PropTypes.number,
    body: PropTypes.string,
    helpfulness: PropTypes.number,
    answerer_name: PropTypes.string,
    date: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string
    }))
  })
};

AnswerItem.defaultProps = {
  answer: {}
};

import React from 'react';
import PropTypes from 'prop-types';

import { Container, Typography } from '@material-ui/core';

import ArtSection from './ArtSection.jsx';
import CommentList from './CommentList.jsx';

export default function Card({ card }) {
  return (
    <Container style={{ padding: 0, margin: '10px 0px 100px 0px' }}>
      <Container style={{ padding: 0, border: '1px solid #ddd' }}>
        <ArtSection imageUrl={card.image} />
        <Typography>{card.username}</Typography>
        <Typography>{card.description}</Typography>
      </Container>
      {/* eslint-disable-next-line no-underscore-dangle */}
      <CommentList cardId={card._id} comments={card.comments} />
    </Container>
  );
}

Card.propTypes = {
  card: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    username: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.object)
  })
};

Card.defaultProps = {
  card: {
    _id: '0',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png',
    description: 'Squirtle Placeholder',
    username: 'Username Placeholder',
    comments: []
  }
};

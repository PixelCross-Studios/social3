import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Container
} from '@material-ui/core';

export default function ArtSection({ imageData }) {
  return (
    <Container className="questionContainer" style={{ padding: 0 }}>

      <canvas />

    </Container>
  );
}

ArtSection.propTypes = {
  imageData: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string
  })
};

ArtSection.defaultProps = {
  imageData: {
    id: 0,
    url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png'
  }
};

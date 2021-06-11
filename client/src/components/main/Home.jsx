import React from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';

import ArtSection from './ArtSection.jsx';

export default function Home({ images }) {
  return (
    <Container className="qaContainer" style={{ margin: '10px 0px 10px 0px', padding: 3, border: '1px solid #ddd' }}>
      <ArtSection imageData={images[0]} />
    </Container>
  );
}

Home.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string
  }))
};

Home.defaultProps = {
  images: [{
    id: 0,
    url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png'
  }]
};

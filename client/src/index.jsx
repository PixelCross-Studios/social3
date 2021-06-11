import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Container from '@material-ui/core/Container';

import Navigation from './components/Navigation.jsx';
import Home from './components/main/Home.jsx';

import { getImages } from './helpers/globalRequest';
import AppContext from './helpers/context';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages()
      .then((imageArr) => {
        setImages(imageArr);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppContext.Provider value={{ }}>
      <Navigation />
      <Container maxWidth="lg">
        <Home images={images} />
      </Container>
    </AppContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));

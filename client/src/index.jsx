import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Container from '@material-ui/core/Container';

import Navigation from './components/Navigation.jsx';
import Home from './components/main/Home.jsx';

import { getCards } from './helpers/globalRequest';
import AppContext from './helpers/context';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getCards()
      .then((postArr) => {
        setCards(postArr);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppContext.Provider value={{ }}>
      <Navigation />
      <Container maxWidth="lg">
        <Home cards={cards} />
      </Container>
    </AppContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));

import React, { useState } from 'react';

import Navigation from './components/Navigation';
import InputUser from './components/InputUser';
import ImageContainer from './components/ImageContainer';

import './App.css';

function App(props) {
  const [user, setUser] = useState("");
  const [img, setImg] = useState("");

  function handleUserChange(new_user) {
    setUser(new_user);
  }

  return (
    <div className="App">
      <Navigation user={user} />

      { user.length == 0 && <InputUser onUserChange={handleUserChange} /> }
      { user.length > 0 && <ImageContainer user={user} /> }
    </div>
  );
}

export default App;

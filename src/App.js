import React, { useState } from 'react';

import Navigation from './components/Navigation';
import InputUser from './components/InputUser';
import ImageContainer from './components/ImageContainer';

import './App.css';

function App() {
  const [user, setUser] = useState("");

  // Receive user from lower level component InputUser and update state
  function handleUserChange(new_user) {
    setUser(new_user);
  }

  return (
    <div className="App">
      <Navigation user={user} />

      { user.length === 0 && <InputUser onUserChange={handleUserChange} /> }
      { user.length > 0 && <ImageContainer user={user} /> }
    </div>
  );
}

export default App;

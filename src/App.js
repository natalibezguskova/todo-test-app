import './App.css';
import React from 'react'
import ModalLayer from './components/modal/ModalLayer'
import MainLayout from './components/mainLayout/MainLayout'

const App = () => {
  return (
      <ModalLayer>
        <MainLayout />
      </ModalLayer>
  );
}

export default App;

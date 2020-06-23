import React, { useState } from 'react';
import LCC from 'lightning-container';
import logo from './logo.svg';
import './App.css';

function App() {
  const [ name, setName ] = useState('');
  const [ account, setAccount ] = useState({
    id: '',
    phone: '',
    type: '',
    numberOfEmployees: undefined
  });

  const handleAccountQueryResponse = (result, event) => {
    if (event.status) {
      setAccount({
        id: result.id,
        phone: result.phone,
        type: result.type,
        numberOfEmployees: result.numberOfEmployees
      });
    } else if (event.type === "exception") {
      console.error(`${event.message}:${event.where}`);
    }
  };

  const callApex = () => {
    LCC.callApex('ApexControllerDemo.getAccount', name, handleAccountQueryResponse, {
      escape: true
    });
  };
  

  const handleAccountNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to LCC</h2>
      </header>
      <div className="App-intro">
        <div className="form-item">
          <label htmlFor="accountName">Account Name: </label>
          <div className="form-item-main">
            <input type="text" id="accountName" value={account.name} onChange={handleAccountNameChange}/>
            <button type="submit" onClick={callApex}>Call Apex Controller</button>
          </div>
        </div>
        <div className="form-item">
          <label>Id: </label>
          <div className="form-item-main">{account.id}</div>
        </div>
        <div className="form-item">
          <label>Phone: </label>
          <div className="form-item-main">{account.phone}</div>
        </div>
        <div className="form-item">
          <label>Type: </label>
          <div className="form-item-main">{account.type}</div>
        </div>
        <div className="form-item">
          <label>Number of Employees: </label>
          <div className="form-item-main">{account.numberOfEmployees}</div>
        </div>
      </div>
    </div>
  );
}

export default App;

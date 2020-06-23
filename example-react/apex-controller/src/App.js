import React, { useState } from 'react';
import LCC from 'lightning-container';
import Debug from 'debug';
import logo from './logo.svg';
import './App.css';

const debug = Debug('*');

function App() {
  const [ name, setName ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ account, setAccount ] = useState({
    id: '',
    phone: '',
    type: '',
    numberOfEmployees: undefined
  });

  const handleAccountQueryResponse = (result, event) => {
    debug('info', result, event);
    if (event.status) {
      setAccount({
        id: result.Id,
        phone: result.Phone,
        type: result.Type,
        numberOfEmployees: result.NumberOfEmployees
      });
    } else if (event.type === "exception") {
      debug('error', `${event.message}:${event.where}`);
    }
    setLoading(false);
  };

  const callApex = () => {
    debug('info', 'callApex, name:', name);
    setLoading(true);
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
            <button type="button" onClick={callApex} className={loading ? 'loading' : ''}>Call Apex Controller</button>
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

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initDB, getConn } from './db/index';
import { PhotoService, LabelService, PhotoLabelService } from './services/';

initDB().then(async () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

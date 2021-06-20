import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Table } from './services/Table';
import { TableManagment } from './services/TableManagment';
import { Group } from './services/Group';
import { Player } from './services/Player';

const tables = [
  new Table('a'),
  new Table('b'),
  new Table('c'),
];

const tableManagment = new TableManagment(tables);

const groups = [
  new Group([new Player('1'), new Player('3')]),
  new Group([new Player('2'), new Player('6')]),
  new Group([new Player('5'), new Player('4')]),
]
tableManagment.x(groups);
tableManagment.manage(groups);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

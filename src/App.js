import React, { Component } from 'react';
import './bootstrap.css';

class App extends Component {

  render() {
    return (
      <div className="container">
        <h1>Donate to Dreams</h1>
        <ul className="nav">
          <li className="nav-item">
            <a href="#" className="nav-link">Launch Display</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Import Data File</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Export Data File</a>
          </li>
        </ul>
        <hr />
        <main>
          <section>
            <form>
              <div className="form-group">
                <label htmlFor="bid-number">Bid Number</label>
                <input type="number" className="form-control" id="bid-number" placeholder="001" required/>
              </div>
              <div className="form-group">
                <label htmlFor="bid-amount">Bid Amount</label>
                <select className="form-control" id="bid-amount" required>
                  <option value="1000">$1,000</option>
                  <option value="100">$100</option>
                  <option value="10">$10</option>
                  <option value="1">$1</option>
                </select>
              </div>
              <div className="form-group">
                <input type="submit" className="form-control btn btn-primary" value="Place Bid" />
              </div>
            </form>
          </section>
          <table className="table table">
            <thead>
              <tr>
                <th>Bid Number</th>
                <th>Name</th>
                <th>Display Name</th>
                <th>Gift Amount</th>
                <th>...</th>
              </tr>
            </thead>
          </table>
        </main>
      </div>
    );
  }
}

export default App;

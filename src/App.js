import React, { Component } from 'react';
import './bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props)

    // Bind the custom methods
    this.launchBtnClicked = this.launchBtnClicked.bind(this)
    this.importBtnClicked = this.importBtnClicked.bind(this)
    this.exportBtnClicked = this.exportBtnClicked.bind(this)
  }

  launchBtnClicked() {
    console.log("Launch Button Clicked")
  }

  importBtnClicked() {
    console.log("Import Button Clicked")
  }

  exportBtnClicked() {
    console.log("Export Button Clicked")
  }

  render() {
    return (
      <div className="container">
        <h1>Donate to Dreams</h1>
        <ul className="nav">
          <li className="nav-item">
            <button className="btn btn-link" onClick={this.launchBtnClicked}>Launch Display</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link" onClick={this.importBtnClicked}>Import Data File</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link" onClick={this.exportBtnClicked}>Export Data File</button>
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

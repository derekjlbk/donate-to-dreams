import React, { Component } from 'react'
import csv from 'fast-csv'
import Papa from 'papaparse'
import fs from "fs"
import firebase from 'firebase'
import bidderData from './bidder-data.json'
import './bootstrap.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bidders: []
    }

    var config = {
      apiKey: "AIzaSyDljWk2kKlAEYrq-qb2hf5sFFSDHqGcMKQ",
      authDomain: "donate-to-dreams.firebaseapp.com",
      databaseURL: "https://donate-to-dreams.firebaseio.com",
      projectId: "donate-to-dreams",
      storageBucket: "donate-to-dreams.appspot.com",
      messagingSenderId: "744299511690"
    };

    firebase.initializeApp(config)

    // Bind the custom methods
    this.launchBtnClicked = this.launchBtnClicked.bind(this)
    this.importBtnClicked = this.importBtnClicked.bind(this)
    this.exportBtnClicked = this.exportBtnClicked.bind(this)
    this.updateBidderData = this.updateBidderData.bind(this)
    this.renderBidderTable = this.renderBidderTable.bind(this)

    firebase.database().ref("bidders").on("value", this.updateBidderData)
  }

  updateBidderData(snapshot) {
    console.log("Updating bidder data")
    var bidderJSON = snapshot.val()
    var bidderARR = []

    for (var key in bidderJSON) {
      bidderARR.push(bidderJSON[key])
    }

    this.setState({
      bidders: bidderARR
    })
    console.log("Bidder data update complete")
  }

  launchBtnClicked() {
    console.log("Launch Button Clicked")
  }

  importBtnClicked() {
    console.log("Import Button Clicked")
     
    var modBidData = {}

    // Reorganize the data by bid number and add a field for
    for (var key in bidderData) {
      let bidder = bidderData[key]
      let bidNumber = bidder["Alias"].split("#")[1]

      bidder.Name = key
      bidder["Donate to Dreams"] = "0"

      modBidData[bidNumber] = bidder
    }

    firebase.database().ref("bidders").set(modBidData)
    .then(() => {
      console.log("Import Complete")
    })
    
  }

  exportBtnClicked() {
    console.log("Export Button Clicked")
  }

  renderBidderTable() {
    console.log("Rendering the bidder table")
    return this.state.bidders.map((bidder) => {
      return <tr key={"bidder-" + bidder["Paddle ID"]}>
        <td>{bidder["Paddle ID"]}</td>
        <td>{bidder["Name"]}</td>
        <td>{bidder["Donate to Dreams"]}</td>
        <td><button className="btn btn-link">Edit</button></td>
      </tr>
    })
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
                <th>Gift Amount</th>
                <th>...</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBidderTable() }
            </tbody>
          </table>
        </main>
      </div>
    );
  }
}

export default App;

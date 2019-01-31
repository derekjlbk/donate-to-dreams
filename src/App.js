import React, { Component } from 'react'
import firebase from 'firebase'
import bidderData from './bidder-data.json'
import './bootstrap.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bidders: [],
      total: 0
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
    this.placeNewBid = this.placeNewBid.bind(this)
    this.exportToCsvFile = this.exportToCsvFile.bind(this)

    firebase.database().ref("bidders").on("value", this.updateBidderData)
  }

  updateBidderData(snapshot) {
    console.log("Updating bidder data")
    var bidderJSON = snapshot.val()
    var bidderARR = []

    var total = 0

    for (var key in bidderJSON) {
      const bidder = bidderJSON[key]
      total = total + Number(bidder["Donate to Dreams"])
      bidderARR.push(bidder)
    }

    this.setState({
      bidders: bidderARR,
      total: total
    })
    console.log("Bidder data update complete")
  }

  launchBtnClicked() {
    console.log("Launch Button Clicked")
    window.open("/display.html",'window','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350')
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

    firebase.database().ref("bidders").once("value")
    .then((snapshot) => {
      const data = snapshot.val()
    
      let bidderData = {}

      for (var key in data) {
        const bidder = data[key]

        bidderData[key] = {
          Number: key,
          Name: bidder["Name"],
          Amount: bidder["Donate to Dreams"]
        }
      }

      //this.exportToCsvFile("bidder-data.csv", bidderData)
      let csvStr = "Paddle ID,Name,Amount\n"
      for (key in bidderData) {
        let row = bidderData[key]
        csvStr += row.Number + "," + row.Name + "," + row.Amount + "\n"
      }
      this.exportToCsvFile("donate-to-dreams-summary.csv", csvStr)
    })
    
    firebase.database().ref("bids").once("value")
    .then((snapshot) => {
      const bidData = snapshot.val()
      let csvStr = "Time,Bid Number,Name,Amount\n"

      for (var key in bidData) {
        let row = bidData[key]
        csvStr += row["time"] + "," + row["number"] + "," + row["name"] + "," + row["amount"] + "\n"
      }
      
      this.exportToCsvFile("donate-to-dreams-data.csv", csvStr)
    })
    
  }

  exportToCsvFile(filename, csvStr) {
    let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;
    
    let exportFileDefaultName = filename;
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  placeNewBid(event) {
    event.preventDefault()
    console.log("Placing a new bid")

    const bidNumber = document.getElementById("bid-number").value
    const amount = document.getElementById("bid-amount").value

    var bidder = {}

    // Get the bidder from the bid number
    for (var i = 0; i < this.state.bidders.length; i++) {
      if (this.state.bidders[i]["Paddle ID"] == bidNumber) {
        bidder = this.state.bidders[i]
        break
      }
    }

    if (Object.entries(bidder).length === 0) {
      console.error("Bidder Number not found")
      alert("Bid number " + bidNumber + " was not found.")
      return
    }

    console.log("Bidder " + bidder["Name"] + " gave $" + amount)

    let bidderData = {}

    // Fetch the bidder with the correct number.
    firebase.database().ref("bidders/" + bidNumber).once("value")
    .then((snapshot) => {
      bidderData = snapshot.val()
      let currentAmount = Number(bidderData["Donate to Dreams"])
      let newAmount = currentAmount + Number(amount)

      bidderData["Donate to Dreams"] = newAmount


      return firebase.database().ref("bidders/" + bidNumber).set(bidderData)
    })
    .then(() => {
      let bid = {
        time: new Date().toLocaleTimeString(),
        number: bidderData["Paddle ID"],
        name: bidderData["Name"],
        amount: amount
      }

      return firebase.database().ref("bids").push(bid)
    })

    document.getElementById("bid-number").value = ""
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
          <li className="nav-item">
            <p className=" btn btn-link"><strong>Total Gift: ${this.state.total}</strong></p>
          </li>
        </ul>
        <hr />
        <main>
          <section>
            <form onSubmit={this.placeNewBid}>
              <div className="form-group">
                <label htmlFor="bid-number">Bid Number</label>
                <input type="number" className="form-control" id="bid-number" placeholder="XXX" required/>
              </div>
              <div className="form-group">
                <label htmlFor="bid-amount">Bid Amount</label>
                <select className="form-control" id="bid-amount" required>
                  <option value="1000">$1,000</option>
                  <option value="500">$500</option>
                  <option value="100">$100</option>
                  <option value="50">$50</option>
                  <option value="25">$25</option>
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
                <th>D2D Amount</th>
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

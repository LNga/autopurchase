import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import axios from 'axios';

const abi = require('../build/contracts/exampleContract.json');
const scAddress = process.env.REACT_APP_address;
const Web3 = require('web3');
var web3;

class App extends React.Component {
  state = {
    modelNumber: '',
    itemref: '',
    txID: '',
    clientID: '',
  };

  componentDidMount() {
    this.instantiateWeb3();
  }

  handleInputTxIDChange(event) {
    this.setState({
      txID: event.target.value,
    });
  }

  handleInputClientIDChange(event) {
    this.setState({
      clientID: event.target.value,
    });
  }

  handleInputRefChange(event) {
    this.setState({
      itemref: event.target.value,
    });
  }

  sendPurchaseRequest() {
    console.log(`Q${this.state.modelNumber}`);
    var data = JSON.stringify([
      {
        id: '2022',
        eventType: 'recordInserted',
        subject: 'myapp/vehicles/motorcycles',
        eventTime: '2017-08-10T21:03:07+00:00',
        data: {
          make: 'Audi',
          model: `Q${this.state.modelNumber}`,
        },
        dataVersion: '1.0',
      },
    ]);
    var config = {
      method: 'post',
      url: '/api/events',
      headers: {
        'aeg-sas-key': '6wSrWMJ35RsA/ds3ZNAqqNsexqGr6LY2s1NHqOyx80c=',
        'Content-Type': 'application/json',
      },
      data: data,
    };
    console.log(data);
    axios(config)
      .then(async function (response) {
        await console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onBuyLater = async () => {
    var accounts = await web3.eth.getAccounts();
    var exampleContract = new web3.eth.Contract(
      abi,
      web3.utils.toChecksumAddress(scAddress)
    );
    await exampleContract.methods
      .foo(3)
      .send({ from: accounts[0] })
      .then((receipt) => {
        if (receipt) {
          const response = receipt.events.ReturnValue.returnValues[1];
          this.setState(
            {
              modelNumber: response,
            },
            () => {
              this.sendPurchaseRequest();
            }
          );
        }
      });
  };

  async instantiateWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      web3 = new Web3(provider);
      await provider.request({
        method: 'eth_chainId',
      });
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      console.error('Please install MetaMask!');
    }
  }

  render() {
    return (
      <div>
        <div className='ui segment'>
          {' '}
          <h4 className='ui header'> Autopurchase App</h4>
          <p>Acheter maintenant, recevez plus tard</p>
        </div>
        <div className='ui segment'>
          <form action='/button-type'>
            <label>
              Item Ref. :<br />
              <input
                type='text'
                name='itemref'
                onChange={this.handleInputRefChange}
              />
            </label>
            <br />
            <br />
            <label>
              Payment Transaction ID:
              <br />
              <input
                type='text'
                name='txID'
                onChange={this.handleInputTxIDChange}
              />
            </label>
            <br />
            <br />
            <label>
              Client ID:
              <br />
              <input
                type='text'
                name='clientID'
                onChange={this.handleInputClientIDChange}
              />
            </label>
            <br />
            <br />
            <button className='ui button primary' onClick={this.onBuyLater}>
              Buy later
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;

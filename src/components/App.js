import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import axios from 'axios';
import bytecode from '../build/contracts/bytecode/autopurchase';

const autopurchaseAbi = require('../build/contracts/autopurchase.json');
const Web3 = require('web3');
var web3;

class App extends React.Component {
  state = {
    modelNumber: '',
    itemref: '',
    txID: '',
    clientID: '',
    scAddress: '',
  };

  componentDidMount() {
    this.instantiateWeb3();
  }

  handleInputTxIDChange = (event) => {
    this.setState({
      txID: event.target.value,
    });
  };

  handleInputClientIDChange = (event) => {
    this.setState({
      clientID: event.target.value,
    });
  };

  handleInputRefChange = (event) => {
    this.setState({
      itemref: event.target.value,
    });
  };

  handleInputSCChange = (event) => {
    this.setState({
      scAddress: event.target.value,
    });
  };

  sendPurchaseRequest() {
    var data = JSON.stringify([
      {
        id: '1',
        eventType: 'recordInserted',
        subject: 'newItemRequested',
        eventTime: '2017-08-10T21:03:07+00:00',
        data: {
          itemref: this.state.itemref,
          txID: this.state.txID,
          clientID: this.state.clientID,
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
    axios(config)
      .then(async function (response) {
        await console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  onBackItem = async (event) => {
    event.preventDefault();
    var data = JSON.stringify([
      {
        id: '2',
        eventType: 'recordInserted',
        subject: 'ItemRequestedBackInStock',
        eventTime: '2022-09-20T21:03:07+00:00',
        data: {
          itemref: this.state.itemref,
          clientID: this.state.clientID,
          scAddress: this.state.scAddress,
        },
        dataVersion: '1.0',
      },
    ]);
    var config = {
      method: 'post',
      url: '/api/events',
      headers: {
        'aeg-sas-key': 'S2fBgcLlmVsula7s6iN9zDedjyt4DqIT7CUHkkHx5Hg=',
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async function (response) {
        await console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  async notifyBackItem() {
    // variables : sc address, account, abi, item ref, clientID
    var scAddress = '0x360f836832b59916b487f9c1f485e11ae17cb404';
    var accounts = await web3.eth.getAccounts();
    var autopurchaseSC = await new web3.eth.Contract(
      autopurchaseAbi,
      scAddress
    );
    await autopurchaseSC.methods
      .backItem('PINKO259', 5) //variable itemref
      .send({ from: accounts[0] }) //variable account
      .then(function (receipt) {
        if (receipt) {
          console.log(receipt);
        }
      });
  }

  onBuyLater = async (event) => {
    event.preventDefault();
    var accounts = await web3.eth.getAccounts();
    console.log(this.state.txID);
    console.log(web3.utils.asciiToHex(this.state.txID));
    console.log(web3.utils.padLeft(web3.utils.asciiToHex(this.state.txID), 64));
    var txID = web3.utils.padLeft(web3.utils.asciiToHex(this.state.txID), 64);
    var autopurchaseContract = await new web3.eth.Contract(autopurchaseAbi);
    var scAddress;
    await autopurchaseContract
      .deploy({
        data: bytecode,
        arguments: [txID, this.state.itemref, this.state.clientID],
      })
      .send({ from: accounts[0] })
      .then((receipt) => {
        if (receipt) {
          scAddress = receipt._address;
        }
      });
    var autopurchaseSC = await new web3.eth.Contract(
      autopurchaseAbi,
      scAddress
    );
    await autopurchaseSC
      .getPastEvents('AskItem', function (error, event) {})
      .then((event) => {
        var response = event[0].returnValues;
        this.setState(
          {
            itemref: response.itemRef,
            txID: response.txNumber,
            clientID: response.clientID,
          },
          () => {
            this.sendPurchaseRequest();
          }
        );
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
            <label>
              Smart Contract Address:
              <br />
              <input
                type='text'
                name='scAddress'
                onChange={this.handleInputSCChange}
              />
            </label>
            <br />
            <br />
            <button className='ui button secondary' onClick={this.onBackItem}>
              Back item
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;

/*
-verifier chaque input
-verifier dans le web3 et afficher un message d'erreur avant le bouton pour indiquer quil n'y a pas de compte
-ne pas faire apparaître dans l'url les valeurs du formulaire au moment du clic sur le bouton 
*/

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Autopurchase {
    
   event AskItem(
        string  itemRef,
        uint  clientID,
        bytes32  txNumber
    );

    event BackItem(
        string  itemRef,
        uint  clientID
    );

   constructor(bytes32 paymentID,string memory itemRef, uint clientID)  {
       isValid(paymentID) ? askItem(itemRef, clientID, paymentID) : selfdestruct(payable(msg.sender)) ;
    }

    function isValid(bytes32 paymentID) public pure returns (bool txValid){
        paymentID.length == 32 ? txValid = true : txValid = false;
    }

    function askItem(string memory itemRef, uint clientID, bytes32 paymentID) private{
        emit AskItem(
         itemRef,
         clientID,
         paymentID
        );
    }

    function backItem(string memory itemRef, uint clientID) public{
        emit BackItem(
            itemRef,
            clientID
        );
    }
}
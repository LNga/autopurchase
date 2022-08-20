// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ExampleContract {

  event ReturnValue(address indexed _from, int256 _value);
  
  function foo(int256 _value) public returns (int256) {
    emit ReturnValue(msg.sender, _value);
    return _value;
  }

}
// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Whitelist {
    // max num of whitelisted addresses allowed
    uint8 public maxWhiteListAddresses;

    // map whitelist addresses to bool for whitelisted
    mapping(address => bool) public whiteListAddresses;

    // num of whitelisted addrs
    uint8 public numAddressesWhitelisted;

    // set max num of to be whitelisted
    constructor(uint8 _maxWhiteListAddresses) {
        maxWhiteListAddresses = _maxWhiteListAddresses;
    }

    // add address to whitelist function
    function addAddressToWhitelist() public {
        // is user whitelisted?
        require(!whiteListAddresses[msg.sender], "Sender has already been whitelisted");
        // confirm list's not exhausted
        require(numAddressesWhitelisted < maxWhiteListAddresses, "More addresses cant be added, Limit reached");
        // add the address to the whitelisted array
        whiteListAddresses[msg.sender] = true;
        // increase num of whitelisted users
        numAddressesWhitelisted += 1;
    }
}
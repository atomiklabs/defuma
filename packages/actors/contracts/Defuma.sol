// "SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@nomiclabs/buidler/console.sol";

contract Defuma {
    using SafeMath for uint256;

    mapping(uint256 => string) public providers;
    uint256 public providersCount;
    mapping(address => string) public providerData;

    event Provider(string provider);

    function registerProvider(string memory providerAddress) public {
        providersCount = providersCount.add(1);
        providers[providersCount] = providerAddress;
        emit Provider(providerAddress);
    }

    function addProviderData(address providerAddress, string memory hash) public {
        providerData[providerAddress] = hash;
    }
}

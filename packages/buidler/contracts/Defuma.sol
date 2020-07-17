pragma solidity >=0.5.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@nomiclabs/buidler/console.sol";

contract Defuma {
    using SafeMath for uint256;

    mapping(uint256 => address) public providers;
    uint256 public providersCount;
    mapping(address => string) public productIpfs;

    function addProvider(address providerAddress) public {
        providersCount = providersCount.add(1);
        providers[providersCount] = providerAddress;
    }

    function addProduct(address providerAddress, string memory hash) public {
        productIpfs[providerAddress] = hash;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public constant ethToPhpRate = 224259; // 1 ETH = 224259 PHP
    bool public isFrozen;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Frozen();
    event Unfrozen();

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        isFrozen = false;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(!isFrozen, "Contract is frozen");
        uint _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // emit the event
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(!isFrozen, "Contract is frozen");
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // Function to convert ETH to PHP
    function convertEthToPhp(uint256 ethAmount) public pure returns (uint256) {
        return ethAmount * ethToPhpRate;
    }

    // Function to freeze the contract (only callable by the owner)
    function freezeContract() public {
        require(msg.sender == owner, "You are not the owner of this account");
        isFrozen = true;
        emit Frozen();
    }

    // Function to unfreeze the contract (only callable by the owner)
    function unfreezeContract() public {
        require(msg.sender == owner, "You are not the owner of this account");
        isFrozen = false;
        emit Unfrozen();
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
}
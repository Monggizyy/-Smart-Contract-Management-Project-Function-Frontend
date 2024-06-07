# -Smart-Contract-Management-Project-Function-Frontend

# Smart Contract Management
This Solidity contract, "Assessment," manages a balance in Ether, allowing deposits, withdrawals, and conversion to Philippine Pesos at a fixed rate. It includes functionality to freeze and unfreeze the contract, with events for tracking state changes.

# Description
This Assesment of smart contracts. It allows users to safely deposit and withdraw money while also emitting events for openness. Transactions can be frozen or unfrozen by the contract owner, and a function makes it easier to convert Ethereum to Philippine Pesos at a set exchange rate. Furthermore, unique error handling guarantees that withdrawals in excess of the available balance are prevented. Within decentralized applications, this contract acts as the fundamental building block for money management and contract state control.

# Getting Started 
So to run this go to https://remix.ethereum.org/ 
Once you're in the website click the start coding and put the provided code here. Then go to Solidity Compiler and run it. And now go to Deploy and Run Transaction to try the provided code.
Or you can try it on vscode using this git clone copy and paste this on the terminal on gitbash (git clone https://github.com/MetacrafterChris/SCM-Starter)

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

    
    function convertEthToPhp(uint256 ethAmount) public pure returns (uint256) {
        return ethAmount * ethToPhpRate;
    }

    
    function freezeContract() public {
        require(msg.sender == owner, "You are not the owner of this account");
        isFrozen = true;
        emit Frozen();
    }

    
    function unfreezeContract() public {
        require(msg.sender == owner, "You are not the owner of this account");
        isFrozen = false;
        emit Unfrozen();
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
}

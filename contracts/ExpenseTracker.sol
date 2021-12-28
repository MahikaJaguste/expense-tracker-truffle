pragma solidity ^0.7.6;
pragma abicoder v2;

contract ExpenseTrackerFactory {

    mapping(address => ExpenseTracker) public userToContract;

    function createExpenseTracker() public {
        ExpenseTracker newExpenseTracker = new ExpenseTracker(msg.sender);
        userToContract[msg.sender] = newExpenseTracker;
    }

    function getExpenseTracker() public view returns (ExpenseTracker) {
        return userToContract[msg.sender];
    }
}

contract ExpenseTracker {

    struct TransactionEntry {
        string description;
        int value;
    }

    TransactionEntry[] private entries;
    address public user;
    int private income;
    int private expense;

    modifier onlyUser() {
        require(msg.sender == user);
        _;
    }

    constructor(address _user) {
        user = _user;
    }

    function addTransaction(string memory description, int value) public onlyUser {
        TransactionEntry memory newTransactionEntry = TransactionEntry({
            description: description,
            value: value
        });
        entries.push(newTransactionEntry);

        if(value >= 0){
            income += value;
        }
        else{
            expense -= value;
        }
    }

    function getTransactions() public view onlyUser returns (TransactionEntry[] memory) {
        return entries;
    }

    function getIncome() public view onlyUser returns (int) {
        return income;
    }

    function getExpense() public view onlyUser returns (int) { 
        return expense;
    }

}
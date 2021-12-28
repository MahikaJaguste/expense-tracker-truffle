const ExpenseTrackerFactory = artifacts.require("ExpenseTrackerFactory");
const ExpenseTracker = artifacts.require("ExpenseTracker")
const truffleAssert = require("truffle-assertions");

contract("Testing the factory contract", async (accounts) => {
    let factory_instance;
    let instance;

    beforeEach("creating a ExpenseTracker instance", async () => {
        factory_instance = await ExpenseTrackerFactory.new();
        await factory_instance.createExpenseTracker({'from':accounts[0]});
        const instance_address = await factory_instance.getExpenseTracker({'from':accounts[0]});
        instance = await ExpenseTracker.at(instance_address);
    });

    it("factory contract and individual tracker contract deployed correctly", async () => {
        assert.ok(factory_instance);
        assert.ok(instance);
    });

    it("can add transaction from correct user account", async () => {
        await instance.addTransaction("Bought batteries", -100, {'from':accounts[0]});
    });

    it("cannot add transaction from different user account", async () => {
        await truffleAssert.reverts(
            instance.addTransaction("Bought wires", -100, {'from':accounts[1]})
        );
    });

    it("can get transaction list and expense/income details from correct user account", async () => {
        await instance.addTransaction("Bought batteries", -100, {'from':accounts[0]});
        await instance.addTransaction("Salary", 200, {'from':accounts[0]});
        const entries = await instance.getTransactions({'from':accounts[0]});
        assert("Bought batteries", entries[0].description);
        assert("Salary", entries[1].description);
        assert(-100, entries[0].value);
        assert(200, entries[1].value);
        const income = await instance.getIncome({'from':accounts[0]});
        const expense = await instance.getExpense({'from':accounts[0]});
        assert.equal(100, expense);
        assert.equal(200, income);
    });

    it("cannot get transaction list and expense/income details from different user account", async () => {
        await truffleAssert.reverts(
            instance.getTransactions({'from':accounts[1]})
        );
        await truffleAssert.reverts(
            instance.getIncome({'from':accounts[1]})
        );
        await truffleAssert.reverts(
            instance.getExpense({'from':accounts[1]})
        );
    });



});
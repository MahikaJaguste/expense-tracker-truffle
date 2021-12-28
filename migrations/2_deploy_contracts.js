var ExpenseTrackerFactory = artifacts.require("ExpenseTrackerFactory");

module.exports = function(deployer) {
  deployer.deploy(ExpenseTrackerFactory);
};
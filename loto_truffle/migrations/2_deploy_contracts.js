const Lottery = artifacts.require("Lottery");
const subscriptionId = 6296;
module.exports = function(deployer) {
  deployer.deploy(Lottery, subscriptionId);
 
};

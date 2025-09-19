const RichardToken = artifacts.require('RichardToken');
module.exports = function (deployer) {
  deployer.deploy(RichardToken);
};

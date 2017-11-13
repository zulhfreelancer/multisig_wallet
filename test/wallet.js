var myWallet = artifacts.require("./MyWallet.sol");

contract('MyWallet', function(accounts) {

  it("it should be possible to put money inside", async function(){
    var contract = await myWallet.deployed();
    // console.log('01 - balance', web3.eth.getBalance(contract.address).toNumber());
    var tx = await contract.sendTransaction({
      from:    accounts[0],
      address: contract.address,
      value:   web3.toWei(10, 'ether')
    });
    assert.equal(
      web3.eth.getBalance(contract.address).toNumber(),
      web3.toWei(10, 'ether'),
      'The balance is same'
    );
    // console.log('02 - balance', web3.eth.getBalance(contract.address).toNumber());
  });

  it('it should belongs to the first account', async function(){
    var contract = await myWallet.deployed();
    // console.log('03 - balance', web3.eth.getBalance(contract.address).toNumber());
    var theOwner = await contract.getOwner.call();
    assert.equal(theOwner, accounts[0], 'The contract is belongs to the first accounts');
    // console.log('04 - balance', web3.eth.getBalance(contract.address).toNumber());
  });

  it('non-owner should be able to propose', async function() {
    var contract = await myWallet.deployed();
    // console.log('05 - balance', web3.eth.getBalance(contract.address).toNumber());
    var proposal = await contract.spendMoney(accounts[1], web3.toWei(5,'ether'), "Because I need money", {from: accounts[1]});
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(10, 'ether'), 'Balance should remain 10 ether');
    // console.log('06 - balance', web3.eth.getBalance(contract.address).toNumber());
  });

  it('owner should be able to spend without approval', async function() {
    var contract = await myWallet.deployed();
    // console.log('07 - balance', web3.eth.getBalance(contract.address).toNumber());
    var proposal = await contract.spendMoney(accounts[1], web3.toWei(5,'ether'), "Because I'm the owner", {from: accounts[0]});
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(5, 'ether'), 'Balance now should be less than 5 ether');
    // console.log('08 - balance', web3.eth.getBalance(contract.address).toNumber());
  });

  it('only owner can approve the proposal', async function(){
    var contract = await myWallet.deployed();
    // console.log('09 - balance', web3.eth.getBalance(contract.address).toNumber());
    var proposal = await contract.spendMoney(accounts[1], web3.toWei(1,'ether'), "Because I need money", {from: accounts[1]});
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(5, 'ether'), 'Balance now should remain unchanged');
    var latest_proposal = await contract.getLatestProposalId.call();
    var approved = await contract.confirmProposal(latest_proposal, {from: accounts[0]});
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(4, 'ether'), 'Balance now should be less than 1 ether');
    // console.log('10 - balance', web3.eth.getBalance(contract.address).toNumber());
  });

  it('non-owner cannot approve the proposal', async function(){
    var contract = await myWallet.deployed();
    // console.log('11 - balance', web3.eth.getBalance(contract.address).toNumber());
    var proposal = await contract.spendMoney(accounts[1], web3.toWei(1,'ether'), "Because I need money", {from: accounts[1]});
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(4, 'ether'), 'Balance now should remain unchanged');
    var latest_proposal = await contract.getLatestProposalId.call();
    var approved = await contract.confirmProposal(latest_proposal, {from: accounts[1]}); // non-owner
    assert.equal(web3.eth.getBalance(contract.address).toNumber(), web3.toWei(4, 'ether'), 'Balance now should remain unchanged');
    // console.log('12 - balance', web3.eth.getBalance(contract.address).toNumber());
  });
  
});

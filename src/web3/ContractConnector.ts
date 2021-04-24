require('dotenv').config()
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(process.env.INFURA_URL);
export default class ContractConnector {
  private static web3 = new Web3(provider);
  private static abi=[
      {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
      {"constant":true,"inputs":[],"name":"getGroupIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
      {"constant":true,"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"}],"name":"getGroup","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256[]","name":"indexes","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
      {"constant":true,"inputs":[{"internalType":"uint256","name":"_indexId","type":"uint256"}],"name":"getIndex","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"ethPriceInWei","type":"uint256"},{"internalType":"uint256","name":"usdPriceInCents","type":"uint256"},{"internalType":"uint256","name":"usdCapitalization","type":"uint256"},{"internalType":"int256","name":"percentageChange","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"}
    ];

  private static contract_Address=process.env.ADDRESS;
  private static contract = new ContractConnector.web3.eth.Contract(ContractConnector.abi, ContractConnector.contract_Address);

  async GetGroupIds () {
      return ContractConnector.contract.methods.getGroupIds().call();
  }

  async GetGroup (id: number) {
      return ContractConnector.contract.methods.getGroup(id).call();
  }

  async GetIndex (indexId: number) {
      return ContractConnector.contract.methods.getIndex(indexId).call();
  }

  async GetBlock() {
      return ContractConnector.web3.eth.getBlock("latest");
  }
}

const CryptoJS = require('crypto-js');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: new Date().toISOString(),
      transactions: [],
      previousHash: "0",
      hash: this.calculateHash(0, new Date().toISOString(), [], "0", 0),
      nonce: 0,
    };
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    return CryptoJS.SHA256(index + timestamp + JSON.stringify(transactions) + previousHash + nonce).toString();
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = {
      from: null,
      to: miningRewardAddress,
      amount: this.miningReward,
    };
    this.pendingTransactions.push(rewardTx);

    const newBlock = this.mineBlock(this.getLatestBlock().index + 1, new Date().toISOString(), this.pendingTransactions, this.getLatestBlock().hash);
    this.chain.push(newBlock);

    this.pendingTransactions = [];
  }

  mineBlock(index, timestamp, transactions, previousHash) {
    let nonce = 0;
    let hash;
    do {
      nonce++;
      hash = this.calculateHash(index, timestamp, transactions, previousHash, nonce);
    } while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0"));

    return {
      index,
      timestamp,
      transactions,
      previousHash,
      hash,
      nonce,
    };
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.from === address) {
          balance -= trans.amount;
        }
        if (trans.to === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.timestamp, currentBlock.transactions, currentBlock.previousHash, currentBlock.nonce)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;

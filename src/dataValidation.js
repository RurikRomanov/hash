class DataValidation {
  constructor() {
    this.blockchain = [];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: new Date().toISOString(),
      data: "Genesis Block",
      previousHash: "0",
      hash: this.calculateHash(0, new Date().toISOString(), "Genesis Block", "0"),
      nonce: 0,
    };
  }

  calculateHash(index, timestamp, data, previousHash, nonce) {
    return CryptoJS.SHA256(index + timestamp + data + previousHash + nonce).toString();
  }

  addBlock(data) {
    const previousBlock = this.blockchain[this.blockchain.length - 1];
    const newBlock = this.mineBlock(previousBlock.index + 1, new Date().toISOString(), data, previousBlock.hash);
    this.blockchain.push(newBlock);
    return newBlock;
  }

  mineBlock(index, timestamp, data, previousHash) {
    let nonce = 0;
    let hash;
    do {
      nonce++;
      hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
    } while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0"));

    return {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
    };
  }

  validateBlock(block) {
    const recalculatedHash = this.calculateHash(block.index, block.timestamp, block.data, block.previousHash, block.nonce);
    return block.hash === recalculatedHash && block.hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join("0");
  }

  validateBlockchain() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      if (!this.validateBlock(currentBlock) || currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  rewardUser(user, amount) {
    // Implement reward logic here
  }
}

module.exports = DataValidation;

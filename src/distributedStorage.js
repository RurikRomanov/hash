const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

class DistributedStorage {
  constructor() {
    this.node = null;
    this.db = null;
  }

  async initialize() {
    this.node = await IPFS.create();
    const orbitdb = await OrbitDB.createInstance(this.node);
    this.db = await orbitdb.keyvalue('distributed-storage');
  }

  async storeData(key, value) {
    await this.db.put(key, value);
  }

  async retrieveData(key) {
    return await this.db.get(key);
  }

  async synchronizeData() {
    const peers = await this.node.swarm.peers();
    for (const peer of peers) {
      await this.db.loadFromAddress(peer.addr);
    }
  }
}

module.exports = DistributedStorage;

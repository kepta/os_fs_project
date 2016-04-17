// import { BLOCK_SIZE } from './';

export default class DiskBlock {
  constructor(index, params) {
    this.data = null;
    this.index = index;
    this.BLOCK_SIZE = params.BLOCK_SIZE;
  }
  insert(data) {
    if (data.length > this.BLOCK_SIZE - 1) {
      this.data = data.slice(0, this.BLOCK_SIZE);
      return data.slice(this.BLOCK_SIZE, data.length);
    }
    this.data = data.slice(0, data.length);
    return false;
  }
  empty = () => {
    this.data = null;
  }
}

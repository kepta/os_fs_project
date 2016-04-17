import { BLOCK_SIZE } from './';

export default class DiskBlock {
  constructor(index) {
    this.data = null;
    this.index = index;
  }
  insert(data) {
    if (data.length > BLOCK_SIZE - 1) {
      this.data = data.slice(0, BLOCK_SIZE);
      return data.slice(BLOCK_SIZE, data.length);
    }
    this.data = data.slice(0, data.length);
    return false;
  }

}

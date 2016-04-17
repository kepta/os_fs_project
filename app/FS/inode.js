import { NO_ADDRESS_BLOCKS } from './'; // last for indirect

import SingleIndirect from './singleIndirect';

export default class Inode {
  constructor(index, attr) {
    this.index = index;
    this.attr = attr;
    this.refs = new Array(9);
    this.length = 0;
    this.getIndex = this.getIndex.bind(this);
    this.addRef = this.addRef.bind(this);
    this.removeRef = this.removeRef.bind(this);
    this.getAllRefs = this.getAllRefs.bind(this);
  }

  getIndex(i) {
    return this.refs[i];
  }

  addRef(ptr) {
    if (this.length === NO_ADDRESS_BLOCKS - 1) { // should be 8
      this.refs[this.length] = new SingleIndirect();
      this.refs[this.length].addRef(ptr);
      this.length = this.length + 1;
      return;
    }
    if (this.length === NO_ADDRESS_BLOCKS ) {
      return this.refs[this.length-1].addRef(ptr);
    }
    this.refs[this.length++] = ptr;
    return;
  }

  removeRef() {
    if (this.length === 0) {
      return null;
    }
    if (this.length === NO_ADDRESS_BLOCKS) {
      var isRemovedFromSIN = this.refs[this.length - 1].removeRef();
      if (!isRemovedFromSIN) {
        this.length = this.length - 1;
        this.refs[this.length] = undefined;
      }
      return;
    }
    this.length = this.length - 1;
    this.refs[this.length] = undefined;
  }

  getAllRefs() {
    if (this.length === NO_ADDRESS_BLOCKS) {
      return  this.refs.slice(0, this.length - 1).concat(this.refs[this.length - 1].getAllRefs());
    }
    return this.refs.slice(0, this.length);
  }

}

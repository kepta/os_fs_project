// import { NO_INODE_REFS } from './'; // last for indirect

import SingleIndirect from './singleIndirect';

export default class Inode {
  constructor(index, attr, params) {
    this.index = index;
    this.attr = attr;
    this.params = params;
    this.NO_INODE_REFS = params.NO_INODE_REFS;

    this.refs = new Array(this.NO_INODE_REFS);
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
    if (this.length === this.NO_INODE_REFS - 1) { // should be 8
      this.refs[this.length] = new SingleIndirect(this.params);
      this.refs[this.length].addRef(ptr);
      this.length = this.length + 1;
      return;
    }
    if (this.length === this.NO_INODE_REFS) {
      this.refs[this.length-1].addRef(ptr);
      return;
    }
    this.refs[this.length++] = ptr;
    return;
  }

  removeAllRefs = () => {
    this.refs = new Array(this.NO_INODE_REFS);
    this.length = 0;
  }

  removeRef() {
    if (this.length === 0) {
      return null;
    }
    if (this.length === this.NO_INODE_REFS) {
      const isRemovedFromSIN = this.refs[this.length - 1].removeRef();
      if (!isRemovedFromSIN) {
        this.length = this.length - 1;
        this.refs[this.length] = undefined;
      }
      return null;
    }
    this.length = this.length - 1;
    this.refs[this.length] = undefined;
    return null;
  }

  getAllRefs() {
    if (this.length === this.NO_INODE_REFS) {
      return this.refs.slice(0, this.length - 1).concat(this.refs[this.length - 1].getAllRefs());
    }
    return this.refs.slice(0, this.length);
  }

}

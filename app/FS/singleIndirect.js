// import { SINGE_INDIRECT_ENTRIES } from './';

export default class SingleIndirect {
  constructor(params) {
    // console.log(params);
    this.SINGE_INDIRECT_ENTRIES = params.SINGE_INDIRECT_ENTRIES;
    this.refs = new Array(this.SINGE_INDIRECT_ENTRIES);
    this.length = 0;

    this.getAllRefs = this.getAllRefs.bind(this);
    this.addRef = this.addRef.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.removeRef = this.removeRef.bind(this);
  }

  getAllRefs() {
    return this.refs.slice(0, this.length);
  }

  getIndex(i) {
    return this.refs[i];
  }

  addRef(ptr) {
    if (this.length + 1>= this.SINGE_INDIRECT_ENTRIES) {
      throw new Error('error max length of SingleIndirect');
    }
    this.refs[this.length++] = ptr;
    return;
  }

  removeRef() {
    if (this.length === 0) {
      return false;
    }
    this.refs[--this.length] = undefined;
    return true;
  }
}

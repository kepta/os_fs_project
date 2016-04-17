
// export const NO_INODE_REFS = 3;

// var INODE_ARRAY_SIZE  = 4096; // kbytes
// export const INODE_ARRAY_SIZE = 10; // kbytes

// export const BLOCK_SIZE = 1024 // bytes
// export const BLOCK_SIZE = 2; // bytes

// export const INODE_SIZE = 64; // bytes
// export const SINGE_INDIRECT_ENTRIES = 512; // number of rows
// export const ADDR = 2; // 2 bytes
export const MAX_FILES = 256; // quantity
export const MAX_FILE_SIZE = 64; // kBytes

// export const FILE_DATA = 16384 ; // kBytes
// export const FILE_DATA = 70; // kBytes

// export const SINGE_INDIRECT_REFS = 512;

// export const DISK_SIZE = INODE_ARRAY_SIZE + FILE_DATA + 2;
export const INODE_OFFSET = 1;
export const ROOT_INODE_ATTR =[0, 'Yesterday', 'Monday']; // size, LM, CR

import DiskBlock from './diskBlock';
import Inode from './inode';


function paramsInit(
  NO_INODE_REFS = 8,
  INODE_ARRAY_SIZE = 4096,
  BLOCK_SIZE = 1024,
  SINGE_INDIRECT_ENTRIES = 512,
  FILE_DATA = 16384) {
  // console.log(arguments);
  return {
    NO_INODE_REFS,
    INODE_ARRAY_SIZE,
    BLOCK_SIZE,
    SINGE_INDIRECT_ENTRIES,
    FILE_DATA,
    DISK_SIZE: INODE_ARRAY_SIZE + FILE_DATA + 2,
  };
}
export default class Disk {
  constructor(params) {
    this.params = paramsInit(params.NO_INODE_REFS,
      params.INODE_ARRAY_SIZE,
      params.BLOCK_SIZE,
      params.SINGE_INDIRECT_ENTRIES,
      params.FILE_DATA);
    this.disk = new Array(this.params.DISK_SIZE);
    this.disk.fill(null);
    this._initFreeBlocks = this._initFreeBlocks.bind(this);

    this.superBlock = {
      inodes: 0,
      diskBlocks: 0,
      freeBlocks: this._initFreeBlocks(),
    };

    this.disk[0] = null; // reserved
    this.disk[1] = this.superBlock;
    this.disk[INODE_OFFSET + 1] = null; // start of Inode N1 is null
    this.superBlock.inodes++;
    this.addInode(ROOT_INODE_ATTR);
  }

  addInode = (attr) => {
    const iNodeIndex = this.superBlock.inodes + 1;
    const iNodeDiskIndex = this.findFreeInodeIndex();
    this.disk[iNodeDiskIndex] = new Inode(iNodeIndex, ROOT_INODE_ATTR, this.params);
    this.superBlock.inodes++;
    return this.disk[iNodeDiskIndex];
  }

  findFreeInodeIndex = () => {
    for (let i=1; i < this.params.INODE_ARRAY_SIZE; i++) {
      if (!this.disk[2 + i]) {return 2+i;}
    }
    throw new Error('Couldn\'t find free inode index in disk');
  }

  removeInode = (iNodeIndex) => {
    this.disk[INODE_OFFSET + iNodeIndex] = undefined;
  }

  _initFreeBlocks = () => {
    const grid = [];
    for (let i = 0; i< this.params.FILE_DATA; i++) {
      grid.push(2+ this.params.INODE_ARRAY_SIZE+ i);
      this.disk[2+ this.params.INODE_ARRAY_SIZE+ i] = new DiskBlock(2+ this.params.INODE_ARRAY_SIZE+ i, this.params);
    }
    return grid;
  }

  getFreeBlock = () => {
    this.superBlock.diskBlocks++;
    return this.superBlock.freeBlocks.shift();
  }

  getIndex = (i) => {
    return this.disk[i];
  }

  setIndex = (i, data) => {
    this.disk[i] = data;
    return;
  }

  createFile(data) {
    let dataLeft = data;
    const inode = this.addInode([0, 'Yesterday', 'Monday']);
    let flag = true;
    while (flag) {
      const freeBlock = this.getFreeBlock();
      dataLeft = this.disk[freeBlock].insert(dataLeft);
      inode.addRef(freeBlock);
      if (!dataLeft) {
        flag = false;
      }
    }
    return inode;
  }

  releaseAllRefs = (iNode) => {
    this.disk[this.iNtoD(iNode)].getAllRefs().forEach(e => {
      this.superBlock.freeBlocks.push(e);
      this.disk[e].empty();
    });
  }

  editFile = (iNode, data) => {
    this.releaseAllRefs(iNode);
    const inode = this.disk[this.iNtoD(iNode)];
    inode.removeAllRefs();
    let flag = true;
    let dataLeft = data;
    while (flag) {
      const freeBlock = this.getFreeBlock();
      dataLeft = this.disk[freeBlock].insert(dataLeft);
      inode.addRef(freeBlock);
      if (!dataLeft) {
        flag = false;
      }
    }
  }

  dToIN(d) {
    return d - 1;
  }

  iNtoD(i) {
    return i + 1;
  }

  readFile(inode) {
    return this.disk[this.iNtoD(inode)].getAllRefs().map((e) => {
      return this.disk[e].data;
    }).join('');
  }

  mkdir(name) {
    const dirStruct = [name];
    let dataLeft = JSON.stringify(dirStruct);
      createFile(data)
    const inode = this.addInode([0, 'Yesterday', 'Monday']);
    let flag = true;
    while (flag) {
      const freeBlock = this.getFreeBlock();
      dataLeft = this.disk[freeBlock].insert(dataLeft);
      inode.addRef(freeBlock);
      if (!dataLeft) {
        flag = false;
      }
    }
  }

  deleteFile(inode) {
    this.disk[1+inode] = null;
  }
}

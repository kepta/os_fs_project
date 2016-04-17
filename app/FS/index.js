
export const NO_ADDRESS_BLOCKS = 3;

// var INODE_ARRAY_SIZE  = 4096; // kbytes
export const INODE_ARRAY_SIZE = 10; // kbytes

// export const BLOCK_SIZE = 1024 // bytes
export const BLOCK_SIZE = 7; // bytes

export const INODE_SIZE = 64; // bytes
export const SINGE_INDIRECT_ENTRIES = 512; // number of rows
export const ADDR = 2; // 2 bytes
export const MAX_FILES = 256; // quantity
export const MAX_FILE_SIZE = 64; // kBytes

// export const FILE_DATA = 16384 ; // kBytes
export const FILE_DATA = 30; // kBytes

export const SINGE_INDIRECT_REFS = 512;

export const DISK_SIZE = INODE_ARRAY_SIZE + FILE_DATA + 2;
export const INODE_OFFSET = 1;
export const ROOT_INODE_ATTR =[0, 'Yesterday', 'Monday']; // size, LM, CR

import DiskBlock from './diskBlock';
import Inode from './inode';


export default class Disk {
  constructor(data) {
    this.disk = new Array(DISK_SIZE);
    this.disk.fill(null);
    this._initFreeBlocks = this._initFreeBlocks.bind(this);

    this.superBlock = {
      inodes: 0,
      diskBlocks: 0,
      freeBlocks: this._initFreeBlocks(),
    };

    // this._initInodes();
    this.disk[0] = null; // reserved
    this.disk[1] = this.superBlock;
    this.disk[INODE_OFFSET + 1] = null; // start of Inode N1 is null
    this.superBlock.inodes++;
    this.addInode(ROOT_INODE_ATTR);
  }

  addInode = (attr) => {
    const iNodeIndex = this.superBlock.inodes + 1;
    this.disk[INODE_OFFSET + iNodeIndex] = new Inode(iNodeIndex, ROOT_INODE_ATTR);
    this.superBlock.inodes++;
    return this.disk[INODE_OFFSET + iNodeIndex];
  }

  removeInode = (iNodeIndex) => {
    this.disk[INODE_OFFSET + iNodeIndex] = undefined;
  }

  _initFreeBlocks = () => {
    const grid = [];
    for (let i = 0; i< FILE_DATA; i++) {
      grid.push(2+ INODE_ARRAY_SIZE+ i);
      this.disk[2+ INODE_ARRAY_SIZE+ i] = new DiskBlock(2+ INODE_ARRAY_SIZE+ i);
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
  }
}

import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
// import sinon from 'sinon';
// import { mount } from 'enzyme';
import FS from '../../app/FS';

const gParams = {
  NO_INODE_REFS: 2,
  INODE_ARRAY_SIZE: 10,
  BLOCK_SIZE: 2,
  SINGE_INDIRECT_ENTRIES: 512,
  FILE_DATA: 50,
};

function getDataIndex(gParams , i) {
  return 2 + gParams.INODE_ARRAY_SIZE + i;
}
describe('<Home />', () => {
  it('should have block 0 should be null', () => {
    const fs = new FS(gParams);
    expect(fs.disk[0]).to.equal(null);
  });
  it('should have block 1 as super block', () => {
    const fs = new FS(gParams);
    expect(fs.disk[1].diskBlocks).to.equal(0);
    expect(fs.disk[1].inodes).to.equal(2);
  });
  it('should have block 2 as n1 which should be null', () => {
    const fs = new FS(gParams);
    expect(fs.disk[2]).to.equal(null);
  });
  it('should have block 3 as n2 which should be root inode', () => {
    const fs = new FS(gParams);
    expect(fs.disk[3].index).to.equal(2);
  });
  it('should  find disk index 4 if I delete n3', () => {
    const fs = new FS(gParams);
    fs.createFile('whahsikfalkjdfljkasnfkladsnlfjkadhslkjfkldasjfwhahsikfalkjdfljkasnfkladsnlfjkadhslkjfkldasjf');
    fs.deleteFile(3, null);
    expect(fs.findFreeInodeIndex()).to.equal(4);
  });
  it('should not give me n2 if I ask for findFreeInodeIndex on a blank FS, should return diskIndex 4', () => {
    const fs = new FS(gParams);
    expect(fs.findFreeInodeIndex()).to.equal(4);
  });
  it('should increase diskblock count on creating a file', () => {
    const fs = new FS(gParams);
    fs.createFile('Kushan joshi');
    expect(fs.disk[1].diskBlocks).to.be.above(0);
  });
  it('should fill up all the blocks', () => {
    const fs = new FS(gParams);
    fs.createFile('Shub');
    fs.createFile('Kushan');
    fs.createFile('Sahil')
    // console.log(fs.disk[2+gParams.INODE_ARRAY_SIZE]);
    expect(fs.disk[getDataIndex(gParams,5)].data).to.equal('Sa');
  });





});

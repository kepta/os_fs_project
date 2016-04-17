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

function getDataIndex(params, i) {
  return 2 + params.INODE_ARRAY_SIZE + i;
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





  it('test editing', () => {
    const params = {
      NO_INODE_REFS: 8,
      INODE_ARRAY_SIZE: 6,
      BLOCK_SIZE: 3,
      SINGE_INDIRECT_ENTRIES: 512,
      FILE_DATA: 6,
    };
    const fs = new FS(params);
    fs.createFile('kushan');
    expect(fs.disk[getDataIndex(params, 0)].data).to.equal('kus');

    fs.createFile('shubham');
    expect(fs.disk[getDataIndex(params, 2)].data).to.equal('shu');

    fs.createFile('sha');
    expect(fs.disk[getDataIndex(params, 5)].data).to.equal('sha');
    fs.editFile(4, 'khu');
    expect(fs.disk[getDataIndex(params, 2)].data).to.equal('khu');
    fs.editFile(3, 'ku');
    fs.createFile('muchhala');
    expect(fs.disk[getDataIndex(params, 0)].data).to.equal('hha');
    expect(fs.readFile(3)).to.equal('ku');
    expect(fs.readFile(4)).to.equal('khu');
    expect(fs.readFile(5)).to.equal('sha');
    expect(fs.readFile(6)).to.equal('muchhala');
  });


});

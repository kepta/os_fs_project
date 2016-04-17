import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
// import sinon from 'sinon';
// import { mount } from 'enzyme';
import FS from '../../app/FS';

describe('<Home />', () => {
  it('should have block 0 should be null', () => {
    const fs = new FS();
    expect(fs.disk[0]).to.equal(null);
  });
  it('should have block 1 as super block', () => {
    const fs = new FS();
    expect(fs.disk[1].diskBlocks).to.equal(0);
    expect(fs.disk[1].inodes).to.equal(2);
  });
  it('should have block 2 as n1 which should be null', () => {
    const fs = new FS();
    expect(fs.disk[2]).to.equal(null);
  });
  it('should have block 3 as n2 which should be root inode', () => {
    const fs = new FS();
    expect(fs.disk[3].index).to.equal(2);
  });
});

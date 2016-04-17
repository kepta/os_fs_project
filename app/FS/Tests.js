var SingleIndirect = require('./singleIndirect');

function testSIN() {
  var sIn = new SingleIndirect();
  sIn.addRef(513);
  sIn.addRef(512);
  sIn.addRef(613);
}

var Inode = require('./inode');

function testInode() {
  console.log('create 12 entries and remove inode singleindirect ref and some of inode');
  var iNode = new Inode(2, ['ramu', 'yesterday']);
  iNode.addRef(1);
  iNode.addRef(2);
  iNode.addRef(3);
  iNode.addRef(4);
  iNode.addRef(5);
  iNode.addRef(6);
  iNode.addRef(7);
  iNode.addRef(8);

  iNode.addRef(9);
  iNode.addRef(10);
  iNode.addRef(11);
  iNode.addRef(12);

  console.log(iNode.getAllRefs());

  iNode.removeRef();
  console.log(iNode.getAllRefs());
  iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());
  iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());
  iNode.addRef(8);
  iNode.addRef(9);
  iNode.addRef(10);
  iNode.addRef(11);
  iNode.addRef(12);
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());iNode.removeRef();
  console.log(iNode.getAllRefs());
  iNode.removeRef();iNode.removeRef();
  console.log(iNode.getAllRefs());

}

testInode();

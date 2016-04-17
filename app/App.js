import React from 'react';
import FS from './FS';
import JSONInspector from 'react-json-inspector';

export default class App extends React.Component {
  foo = () => {
    return <JSONInspector data={ this.FS.disk } />;
  }
  render() {
    const gParams = {
      NO_INODE_REFS: 2,
      INODE_ARRAY_SIZE: 10,
      BLOCK_SIZE: 2,
      SINGE_INDIRECT_ENTRIES: 512,
      FILE_DATA: 3,
    };
    this.FS = new FS(gParams);
    this.FS.createFile('kush');
    this.FS.editFile(3, 'ku');
    this.FS.createFile('xkcd');
    // console.log(this.FS.readFile(3));
    return (
      <div>
        {this.foo()}
      </div>
    );
  }
}

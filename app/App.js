import React from 'react';
import FS from './FS';
import JSONInspector from 'react-json-inspector';
import { Input } from 'react-bootstrap';

export default class App extends React.Component {
  constructor() {
    super();
    this.params = {
      NO_INODE_REFS: 4,
      INODE_ARRAY_SIZE: 30,
      BLOCK_SIZE: 4,
      SINGE_INDIRECT_ENTRIES: 512,
      FILE_DATA: 90,
    };
    this.FS = new FS(this.params);
    this.FS.addFileToDir('kushan', 'this contains awesomeness', 2);
  }

  state = {
    console: [],
    value: '',
  }
  oldDir = [];

  currentDir = 2;

  foo = () => {
    return <JSONInspector  data={ this.FS.disk } />;
  }

  displayInode(inode) {
    const obj = {
      index: inode.index,
      attr: inode.attr,
    };

    obj.data = inode.refs.map(e => {
      return {
        addr: e,
        value: Number.isInteger(e) ? this.FS.disk[e].data : 'refer to SingleIndirect',
      }
    });
    if (inode.length === this.params.NO_INODE_REFS) {
      console.log(inode.refs, inode.length);
      obj.indirect = inode.refs[inode.length - 1].refs.map(e => {
        return {
          addr: e,
          value: this.FS.disk[e].data,
        }
      });
    }
    return obj;
  }
  addItemToState(json, command, inode) {
    const data = {
      command,
      output: json,
      inode: inode && this.displayInode(inode),
    };
    this.setState({
      console: this.state.console.concat([
        <JSONInspector isExpanded={(key, q) => key === 'output'} data={data} />
      ]),
      value: '',
    });
  }
  printConsole = () => {
    return this.state.console.map((e, k) => <div key={k}>{e}</div>);
  }
  changers = () => {
    return this.setState({
      value: this.refs.input.getValue(),
    });
  }
  handleChange = (e) => {
    if (e.key === 'Enter') {
      let input = this.refs.input.getValue();
      input = input.split(' ');
      const command = this.refs.input.getValue();
      // console.log(this.refs.input.refs.getDOMNode().value);
      if (input[0] === 'touch') {
        if (!input[1]) {
          alert('Please input some file name');
          return;
        }
        const inode = this.FS.addFileToDir(input[1], '', this.currentDir) ; // this.FS.createFile(input[1]);
        this.addItemToState('created file', command, inode);
      } else if (input[0] === 'ls') {
        this.addItemToState(this.FS.ls(this.currentDir), command);
      } else if (input[0] === 'cat') {
        if (!input[1]) {
          alert('Please input some file name');
          return;
        }
        const inodeValue = this.FS.getInodeOfFileInDir(this.currentDir, input[1])[0].inode;
        const inode = this.FS.disk[this.FS.iNtoD(inodeValue)];
        this.addItemToState(this.FS.readFile(inodeValue), command, inode);
      } else if (input[0] === 'write') {
        if (!input[1]) {
          alert('Please input name of file name');
          return;
        }
        let inodeValue = this.FS.getInodeOfFileInDir(this.currentDir, input[1])[0];
        if (!inodeValue) {
          alert('Please');
        }
        inodeValue = inodeValue.inode;
        if (command.indexOf('\"') === -1) {
          alert('please use write <filename> "content of fire"');
          return;
        }
        const written = command.slice(command.indexOf('\"')+1, command.length - 1);
        this.FS.editFile(inodeValue, written);
        this.addItemToState('file changes saved', command, this.FS.disk[this.FS.iNtoD(inodeValue)]);
      } else if (input[0] === 'rm') {
        if (!input[1]) {
          alert('Please input name of file name');
          return;
        }
        this.FS.rmFileFromDir(input[1], this.currentDir);

        this.addItemToState('file removed successfully', command);
      } else if (input[0] === 'mkdir') {
        if (!input[1]) {
          alert('Please input name of dir name');
          return;
        }
        const newDir = this.FS.mkdir(input[1], this.currentDir);
        this.addItemToState('new Dir added', command, newDir);
      } else if (input[0] === 'cd') {
        if (!input[1]) {
          alert('Please input name of dir name or ..');
          return;
        }
        if (input[1] === '..') {
          this.currentDir = this.oldDir.pop();
        } else {
          let newNode = this.FS.getInodeOfFileInDir(this.currentDir, input[1])[0].inode;
          newNode = this.FS.disk[this.FS.iNtoD(newNode)];
          this.oldDir.push(this.currentDir);
          this.currentDir = newNode.index;
          console.log(this.currentDir);
          this.addItemToState('changed current dir', command, newNode);
          return;
        }
      }
    }
  }

  render() {


    // const rootInode = this.FS.mkdir('root');
    // console.log(rootInode.index);
    // this.FS.addFileToDir('muchhala', 'this contains dakaar', 2);

    return (
      <div>
        {this.foo()}
        {this.printConsole()}
        <Input
          type="text"
          placeholder="Enter Command"
          label="Visit FS"
          value={this.state.value}
          help="Press enter to execute"
          hasFeedback
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          onKeyPress={this.handleChange}
          onChange={this.changers}
        />
      </div>
    );
  }
}

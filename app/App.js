import React from 'react';
import FS from './FS';
import JSONInspector from 'react-json-inspector';

export default class App extends React.Component {
  constructor() {
    super();
    this.FS = new FS();
    this.FS.createFile('Kushan the great');
  }
  foo = () => {
    return <JSONInspector data={ this.FS.disk } />;
  }
  render() {
    return (
      <div>
        {this.foo()}
      </div>
    );
  }
}

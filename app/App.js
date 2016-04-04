import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';

import Login from './Components/Login';
import Loading from './Components/Loading';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';

import Todo from './Widgets/Todo';
import Intranet from './Widgets/Intranet';

class App extends React.Component {
  requireAuth = (nextState, replace) => {
    if (this.props.login.STATUS !== 'LOGGED_IN') {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  render() {
    return (
      <div className="app">
        <Router history={this.props.history}>
          <Route path="/" component={Home} onEnter={this.requireAuth}>
            <IndexRoute component={Dashboard}/>
            <Route path="intranet" component={Intranet} />
            <Route path="todo" component={Todo} />
          </Route>
          <Route path="login" component={Login} />
          <Route path="loading" component={Loading} />
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  history: React.PropTypes.object.isRequired,
  login: React.PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return { ...state.reducer };
}

export default connect(mapStateToProps)(App);

import React, { Component } from 'react';

import {
	BrowserRouter as Router,
	Redirect,
	Switch,
	Route,
} from 'react-router-dom';

import RunAlgorithm from './pages/RunAlgorithm/RunAlgorithm';
import MainPage from './pages';
import LoginPage from './pages/Login/Login';
import UserVerification from "./pages/UserVerication/UserVerication"

import { useAuth } from './AuthContext';
import CreateUser from './components/CreateUser/CreateUser';
import ErrorPage from './pages/Error';


const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

  

class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/login" component={LoginPage}/>
					<Route path="/create-user" component={CreateUser}/>
					<Route path="/user-verification" component={UserVerification} />
					<Route path="/error" component={ErrorPage}/>
					<PrivateRoute path="/run-algorithm" component={RunAlgorithm} />
					<PrivateRoute path="/" component={MainPage}/>
				</Switch>
			</Router>
		);
	}
}

export default App;
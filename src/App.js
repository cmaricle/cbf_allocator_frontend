import React, { Component } from 'react';

import {
	BrowserRouter as Router,
	Redirect,
	Switch,
	Route,
} from 'react-router-dom';
import { Flex } from '@chakra-ui/react'

import RunAlgorithm from './pages/RunAlgorithm/RunAlgorithm';
import MainPage from './pages';
import LoginPage from './pages/Login/Login';
import UserVerification from "./pages/UserVerication/UserVerication"

import { useAuth } from './AuthContext';
import CreateUser from './components/CreateUser/CreateUser';
import ErrorPage from './pages/Error';
import NotFound from './pages/NotFound'
import NationPage from './pages/NationPage/NationPage';
import About from './pages/About/About'


const PrivateRoute = ({ component: Component, runAlgo, location, ...rest }) => {
  const { authenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated && (runAlgo ? location.state : true) ? 
		(
          <Component {...props} />
        ) : (
          <Redirect to={(!runAlgo ? true : location.state) ? "/login" : "/"} />
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
					<Route path="/404" component={NotFound} />
					<PrivateRoute path="/profile/:id" runAlgo={false} component={NationPage}/>
					<PrivateRoute path="/about" runAlgo={false} component={About}/>
					<PrivateRoute path="/run-algorithm" component={RunAlgorithm} runAlgo={true}/>
					<PrivateRoute path="/" runAlgo={false} component={MainPage}/>
				</Switch>
			</Router>
		);
	}
}

export default App;
import React from 'react';
import { connect } from 'react-redux';
import LoginComponent from '../views/Login';
import HomeComponent from '../views/Home';
import DashboardComponent from '../views/Dashboard';
import PageNotFoundComponent from '../views/Not-Found';
import FaqComponent from '../views/Faq';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => {
            return rest.authed === true ? (
                <Component {...props} {...rest} />
            ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )
        }
        }
        />
    );
}

const Routes = (props) => {

    let authed = false;

    if (localStorage.getItem("token")) {
        authed = true;
    }
    return (
        <Router>
            <Switch>
                <Route path="/" exact render={props => { return <LoginComponent authed={authed} {...props} /> }} />
                <PrivateRoute authed={authed} path="/conversation"  component={HomeComponent} />
                <PrivateRoute authed={authed} path="/dashboard"  component={DashboardComponent} />
                <Route render={props => <PageNotFoundComponent />} />
                
            </Switch>
        </Router>
    )
}

function mapStateToProps(state) {
    return {
        state: state
    };
}

export default connect(mapStateToProps)(Routes);
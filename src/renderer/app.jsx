import React from "react";
import { render } from "react-dom";
import { Router, Route, hashHistory } from "react-router";
import Login from "./Login";
import Signup from "./SignUps/Singup";
import SignupEmail from "./SignUps/SingUp-Email";
import Rooms from "./Rooms";
import Room from "./Room";

// Routing 정의하기
const appRouting = (
    <Router history={hashHistory}>
        <Route path="/">
            <Route path="login" component={Login} />
            <Route path="signup" component={Signup} />
            <Route path="signupEmail" component={SignupEmail} />
            <Route path="rooms" component={Rooms}>
                <Route path=":roomId" component={Room} />
            </Route>
        </Route>
    </Router>
);

// Routing 초기화하기
if (!location.hash.length) {
    location.hash = "#/login";
}

render(appRouting, document.getElementById("app"));
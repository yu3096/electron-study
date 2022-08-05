import React from "react";
import { Link, hashHistory } from "react-router";
import Errors from './Errors';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const FORM_STYLE = {
  margin: "0 auto",padding: 30
};

const SIGNUP_LINK_STYLE = {
  display: "inline-block",marginLeft: 10
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.userEmail || '',
      password: localStorage.userPassword || '',
      errors: [],
    };

    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }
  
  handleOnChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  
  handleOnChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  
  handleOnSubmit(e) {
    const { email, password } = this.state;
    const errors = [];
    let isValid = true;
    e.preventDefault();

    if (!email.length) {
      isValid = false;
      errors.push("Email can't be blank.");
    }

    if (!password.length) {
      isValid = false;
      errors.push("Password can't be blank.");
    }

    if (!isValid) {
      this.setState({ errors });
      return;
    }
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(auth.currentUser.emailVerified);
        if(auth.currentUser.emailVerified){
          // Signed in
          const user = userCredential.user;
          localStorage.userEmail = email;
          localStorage.userPassword = password;
          hashHistory.push('/rooms');
        }
        else{
          const errorMessage = '이메일 인증 안됐지롱~';
          this.setState({errors: [errorMessage]});
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        this.setState({errors: [errorMessage]});
      });
    // Firebase 로그인 처리
    /*
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      // 다음 접속 때 로그인을 생략할 수 있도록 localStorage에 정보 저장
      localStorage.userEmail = email;
      localStorage.userPassword = password;

      // 채팅방 목록으로 이동
      hashHistory.push('/rooms');
    }).catch(() => {
      // firebase에서 로그인 오류 발생 시
      this.setState({errors: ["Incorrect email or password."]});
    });
    */
  }
  
  render() {
    return (
      <form style={FORM_STYLE} onSubmit={this.handleOnSubmit}>
        <Errors errorMessages={this.state.errors} />

        <div className="form-group">
          <label>Email address</label>
          <input 
            type="email"
            className="form-control"
            placeholder="email"
            onChange={this.handleOnChangeEmail}
            value={this.state.email}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            className="form-control"
            placeholder="password"
            onChange={this.handleOnChangePassword}
            value={this.state.password}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-large btn-default">
            Login
          </button>
          <div style={SIGNUP_LINK_STYLE}>
            <Link to="/signup">create new account</Link>
            <br />
            <Link to="/signupEmail">create new account by Email</Link>
          </div>
        </div>
      </form>
    );
  }
}
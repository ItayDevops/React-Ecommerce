import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './style.scss'; 
import { useDispatch, useSelector } from "react-redux";


const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginPress = async (e) => {
    e.preventDefault();
    const currentUser = users.find((user) => {
      return user.username === userName && user.password === password;
    });
  
    if (userName === '') {
      alert('Enter user name');
      return;
    }
  
    if (password === '') {
      alert('Enter password');
      return;
    }
  
    if (userName === 'admin' && password === 'admin') {
      navigate('/Admin');
    } else if (currentUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
   
      navigate('/UserConsole');
    } else {

      alert('Username or password incorrect');
    }
  };
  

  return (
    <div className="login-container">
      <h1 className="title">Next Generation E-commerce</h1>
      <form onSubmit={loginPress}>
        <label htmlFor="floatingInput">Username</label>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="User name"
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="username" 
          />
        </div>
        <label htmlFor="floatingPassword">Password</label>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password" 
          />
        </div>
        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
      <div className="register-link">
        New user? <Link to="/Register">Register</Link>
      </div>
    </div>
  );
};

export default Login;

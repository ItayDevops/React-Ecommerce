import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.scss'; 
import { addDoc,collection } from "firebase/firestore";
import { useDispatch } from "react-redux"
import db from "../firebase";


const Register = () => {
  const [user,setUser]=useState([])
  const [fName,setFname]=useState('')
  const [lName,setLname]=useState('')
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const createUser = async () => {
    const updatedUser={...user,name: `${fName} ${lName}`}
    const newDoc = await addDoc(collection(db, 'users'), updatedUser);
    const id = newDoc.id;
    const finalUser = { ...updatedUser, id: id };
    setUser(finalUser);
    dispatch({ type: "ADD_USER", payload: finalUser });
    dispatch({ type: "SET_CURRENT_USER", payload: finalUser });
    navigate ('/UserConsole')
  };

  
  return (
    <div className="register-container">
      <h1 className="title">New User Registration</h1>
      <label htmlFor="firstName">First Name</label>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="firstName"
          placeholder="First Name"
          onChange={(e) => setFname(e.target.value)}
        />
      </div>
      <label htmlFor="lastName">Last Name</label>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="lastName"
          placeholder="Last Name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>
      <label htmlFor="userName">Username</label>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="userName"
          placeholder="Username"
          onChange={(e) => setUser({...user,userName:e.target.value})}
        />
      </div>
      <label htmlFor="password">Password</label>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          onChange={(e) => setUser({...user,password:e.target.value})}
        />
      </div>
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="showOrders"
        onChange={ (e) => e.target.checked ? setUser({...user,isAllowedOrders:true}) : setUser({...user,isAllowedOrders:false}) }/>
        <label className="form-check-label" htmlFor="showOrders">
          Allow others to see my orders
        </label>
      </div>
      <button
        onClick={createUser}
        className="btn-login"
      >
        Create
      </button>
    </div>
  );
};

export default Register;

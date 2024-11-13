import Admin from "./Components/Admin";
import Register from "./Components/Register";
import Login from "./Components/login"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {useEffect} from 'react'
import {addDoc,collection,deleteDoc,doc,onSnapshot,query,updateDoc} from 'firebase/firestore';
import db from './firebase'
import UserConsole from "./Components/UserConsole";
import Customers from "./Components/Customers";
const App = () => {

  const dispatch = useDispatch();

    useEffect(() => {
      const q = query(collection(db, 'categories'));
    
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categories = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const fields = Object.keys(data).filter(key => key !== 'status' && key !== 'id');
          const categoryName = fields.length > 0 ? fields[0] : 'Unknown';
    
          return {
            id: doc.id,
            name: categoryName,
            status: data.status,
          };
        });
    
        dispatch({ type: 'LOAD', payload: categories });
    
      });
    
      return () => unsubscribe(); //clean 
    }, [dispatch]);
  



return (

  <>
  <Customers/>
  <Router>
<Routes>
<Route path="/" element={<Login />}/>
<Route path="/Register" element={<Register />}/>
<Route path="/Admin" element={<Admin  />}/>
<Route path="/UserConsole" element={<UserConsole />}/>
</Routes>
  </Router>
  
  </>
)
}
export default App
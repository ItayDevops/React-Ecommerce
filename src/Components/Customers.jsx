import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {collection,onSnapshot,query} from 'firebase/firestore';
import db from '../firebase'; 


const Customers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(db, 'users'));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => {
        const data = doc.data();

  

  
        return {
          id: doc.id,
          name: data.name,
          joinedAt: data.joinedAt,
          productsBought: data.productsBought,
          username: data.username,
          password:data.password,
          isAllowedOrders:data.isAllowedOrders
          
        };
      });
  
      dispatch({ type: 'LOAD_USERS', payload: users });
     

    });
  
    return () => unsubscribe(); 
  }, [dispatch]);

  return null
};

export default Customers;

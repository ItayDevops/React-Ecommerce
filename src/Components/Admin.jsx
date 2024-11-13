import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc, getDoc, deleteField} from 'firebase/firestore';
import Tables from './Tables';
import db from '../firebase';
import './style.scss';
import Products from './Products';
import Statistics from './Statistics'
import { useNavigate } from 'react-router-dom';

const Admin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const categories = useSelector((state) => state.categories.categories);
  const users = useSelector((state) => state.users.users); 
  
  ///////////////////////////////

  const [showUpdate, setShowUpdate] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [docId, setDocId] = useState('');
  const [showCustomers, setShowCustomers] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [addProduct,setAddProduct]=useState(false)
  const [newProduct,setNewProduct]=useState([])
  const [showStatistics,setShowStatistics]=useState(false)

// Handle adding a new category
const handleAddCategory = async () => {
  if (newCategoryName) {
    try {
      
      const newCategory = {
        [newCategoryName]: [] // Create an empty array with the category name as the key
      };
      const newDoc = await addDoc(collection(db, 'categories'), newCategory);
      
      // Get the generated document ID
      const id = newDoc.id;
      const updatedCategory = { ...newCategory, id: id };
      setNewCategoryName(''); 
      dispatch({ type: 'ADD_category', payload: updatedCategory });
      console.log("Category added successfully:", updatedCategory);
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  }
};

  // Handle updating a category
  const handleUpdate = async () => {
    if (!docId || !updatedName) {
      console.error('Document ID or updated name is missing.');
      return;
    }

    try {
      const docRef = doc(db, 'categories', docId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.error('Document does not exist.');
        return;
      }

      const data = docSnapshot.data();
      const oldFieldName = Object.keys(data).find(key => key !== 'status');

      if (oldFieldName) {
        const updates = {
          [updatedName]: data[oldFieldName],
          [oldFieldName]: deleteField(),
          status: 'CHANGED'
        };

        await updateDoc(docRef, updates);
        dispatch({ type: 'UPDATE', payload: { id: docId, name: updatedName } });
        setShowUpdate(false);
        setUpdatedName('');
      } else {
        console.error('Old field name not found.');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  // Handle deleting a category
  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      dispatch({ type: 'DELETE', payload: id });
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
//Add New Product
  const handelAddProduct = async () =>{
  const newDoc = await addDoc(collection(db, 'products'), newProduct);
  const id = newDoc.id;
  setNewProduct({...newProduct,id:id})
  
  dispatch({type:'ADD_product',payload:newProduct})
  setShowProducts(true)
  setAddProduct(false)
  }


  return (
    <div className="admin-container">
      <h6 className="admin-title">Hello, Admin</h6>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a onClick={() => { setShowCategories(true); setShowCustomers(false);setShowProducts(false);setShowStatistics(false)   }} className="navbar-brand" href="#">Categories</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a onClick={() => { setShowCustomers(false); setShowCategories(false);setShowProducts(true) ;setShowStatistics(false) }} className="nav-link active" aria-current="page" href="#">Products</a>
              </li>
              <li className="nav-item">
                <a onClick={() => { setShowCustomers(true); setShowCategories(false); setShowProducts(false);setShowStatistics(false) }} className="nav-link" href="#">Customers</a>
              </li>
              <li className="nav-item">
                <a onClick={() => { setShowCustomers(false); setShowCategories(false); setShowProducts(false); setShowStatistics(true) }} className="nav-link" href="#">Statistics</a>
              </li>
              <li className="nav-item">
              <a onClick={() => navigate('/')} className="nav-link" href="#">Log Out</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br />
    
      {showCategories && (
        <div>
          <h1 className='title'>Categories</h1>
          <div className="category-container">
            {categories.filter((category) => category.status !== 'DELETED').map((category) => (
              <div key={category.id} className="category-box">
                <h2 className="category-name">{category.name}</h2>
                <div className="button-group">
                <button className="btn btn-update" onClick={() => { setShowUpdate(true); setDocId(category.id); }}>Update</button>
                <button className="btn btn-delete" onClick={() => deleteCategory(category.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {showUpdate && (
            <div className="update-form">
              <input className='form-control-mini'
                type="text"
                placeholder="Enter New Name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
              <button className="btn btn-save" onClick={handleUpdate}>Save</button>
              <button className="btn btn-cancel" onClick={() => setShowUpdate(false)}>Cancel</button>
            </div>
          )}

          <br />
          <div className="add-category-container">
  <input
    type="text"
    placeholder="Add New Category"
    value={newCategoryName}
    onChange={(e) => setNewCategoryName(e.target.value)}
    className="input-category"
  />
  <button className="btn btn-add" onClick={handleAddCategory}>
    Add
  </button>
</div>


        </div>
      )}

      {showCustomers && (
        <div>
            
          <h1 className='title'>Customers</h1>
          <Tables
            data={users}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'joinedAt', label: 'Joined At' },
              { key: 'productsBought', label: 'Products Bought' }
            ]}
          />
        </div>
      )}
      {showProducts && (
        <div>
        <h1 className='title'>Products</h1>
                  <Products />  

        <div className="btn-container">
          <button onClick={() => {setShowProducts(false) ; setAddProduct(true)}} className="btn btn-update">Add New</button>
        </div>
      </div>
        )}


{addProduct && (
  <div> 
    
<div  className="products-container">
            <div className="left-section">
              <div className="form-control-mini">
                
                <strong>Title:</strong>
                <input className="form-control-mini" type="text" onChange={(e) => setNewProduct({...newProduct,name:e.target.value})} />
                <br /><br />

                <strong>Category:</strong>
                <select onChange={(e) => setNewProduct({...newProduct,category:e.target.value})}>
                  <option >Clothing</option>
                  <option >Toys</option>
              
                
                </select>
                <br /><br />

                <strong>Description:</strong>
                <br />
                <textarea
                  className="form-control-mini"
                  onChange={(e) => setNewProduct({...newProduct,description:e.target.value})}
                />
                <br /><br />

                <button className="btn btn-save">Save</button>
                <br /><br />
              </div>
            </div>
            <div className="right-section">
              <div className="box">
                <div className="price-link-container">
                  <div>
                    <strong>Price: </strong>
                    <input type="text"  className="input-wide" onChange={(e) => setNewProduct({...newProduct,price:e.target.value})}/>
                  </div>
                  <div>
                    <strong>Link: </strong>
                    <input type="text"  className="input-wide" onChange={(e) => setNewProduct({...newProduct,link:e.target.value})}/>
                  </div>
                  <div>
                      <strong>Bought By: </strong><br />
                      Name: 
                      <input 
                        type="text" 
                        className="input-wide" 
                        onChange={(e) => setNewProduct(prevState => ({ ...prevState, boughtBy: [{ ...prevState.boughtBy?.[0], name: e.target.value }] }))} 
                      /><br />
                      
                      Qty: 
                      <input 
                        type="text" 
                        className="input-wide" 
                        onChange={(e) => setNewProduct(prevState => ({ ...prevState, boughtBy: [{ ...prevState.boughtBy?.[0], qty: e.target.value }] }))} 
                      /><br />
                      
                      Date: 
                      <input 
                        type="text" 
                        className="input-wide" 
                        onChange={(e) => setNewProduct(prevState => ({ ...prevState, boughtBy: [{ ...prevState.boughtBy?.[0], date: e.target.value }] }))} 
                      /><br />
                  </div>

                    </div>
                    </div>
                    </div>
                    </div>
                  <div className="update-form">
                    <button className="btn btn-cancel  " onClick={() =>{ setShowProducts(true); setAddProduct(false)}}>Cancel</button>
                    <button className="btn btn-save" onClick={handelAddProduct}>Add</button>
                    </div>

  </div>
)}
{showStatistics &&
<div>
  <h1 className='title'>Statistics</h1>
  <br />
<Statistics /> 
</div>
}
    </div>
  );
};

export default Admin;

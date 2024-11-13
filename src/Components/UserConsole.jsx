import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import db from "../firebase";
import { doc, updateDoc } from 'firebase/firestore';
import Tables from "./Tables";
import { SwipeableDrawer, IconButton, Divider } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import SearchBox from "./searchBox";
const UserConsole = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const users=useSelector((state)=>state.users.users)
  const totalPrices = currentUser.productsBought.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', '')); // Remove the '$' symbol and convert to a number
    return total + price * item.qty;
  }, 0);
  const [filters, setFilters] = useState({ title: '', price: '100', category: 'All' });

  const handleFilter = (newFilters) => {

    setFilters(newFilters);
  };

  const [open, setOpen] = useState(false);
  const toggleCart = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAccount, setShowAccount] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: '',
    lastName: '',
    username: currentUser?.username || '',
    password: '',
  });
  const allowedUsers=useSelector((state)=> state.users.users.filter((user) => user.isAllowedOrders))
  console.log(allowedUsers,'allowed users')

  const saveChanges = async () => {
    const fullName = updatedUser.firstName + ' ' + updatedUser.lastName;
    const updatedData = { 
      ...currentUser, 
      name: fullName, 
      username: updatedUser.username, 
      password: updatedUser.password,
      productsBought: currentUser.productsBought, // Keeping the productsBought as it is
      total: totalPrices // Store the total price
    };
    
    const docRef = doc(db, 'users', currentUser.id);
    await updateDoc(docRef, updatedData);
    
    dispatch({ type: 'UPDATE_USER', payload: updatedData });
    dispatch({ type: 'SET_CURRENT_USER', payload: updatedData });
    alert('Changes Saved');
  };

  if (currentUser && currentUser.name && !updatedUser.firstName && !updatedUser.lastName) {
    const splitNames = currentUser.name.split(' ');
    setUpdatedUser({ 
      ...updatedUser, 
      firstName: splitNames[0], 
      lastName: splitNames.slice(1).join(' ') 
    });
  }
  const increaseProduct = (productId) => {
    dispatch({ type: 'INCREASE_PRODUCT', payload: { userId: currentUser.id, productId } });
  };
  const decreaseProduct = (productId) => {
    dispatch({ type: 'DECREASE_PRODUCT', payload: { userId: currentUser.id, productId } });
  };
  const removeProduct = (productId) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: { userId: currentUser.id, productId } });
  };

  const filteredProducts = currentUser.productsBought.filter(product => {
    const matchesTitle = filters.title === '' || product.name.toLowerCase().includes(filters.title.toLowerCase());
    
    // Handle price filter correctly if the filter is a valid number
    const matchesPrice = filters.price === '' || parseFloat(product.price.replace('$', '')) <= parseFloat(filters.price);
    const matchesCategory = filters.category === 'All' || product.category === filters.category;
  
    return matchesTitle && matchesPrice && matchesCategory;
  });

  const handleOrder = async () => {
  
    if (!currentUser || !currentUser.id) {
      console.error("No current user found.");
      return;
    }
  
    // Filter products to include only those with qty > 0
    const updatedProducts = currentUser.productsBought.filter(product => product.qty > 0); 

    const userRef = doc(db, 'users', currentUser.id);
  
    try {
      await updateDoc(userRef, {
        productsBought: updatedProducts, // Update Firestore 
      });
  
      console.log("Order successfully updated in Firestore.");
      navigate('/'); 
    } catch (error) {
      console.error("Error updating order in Firestore:", error);
    }
  };
  
  

  return (
    <div>
      <div className="title">
        {currentUser ? <h3>Hello, {currentUser.name}</h3> : <h3>No user data available</h3>}
      </div>

      <div className="admin-container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a onClick={() => { setShowProducts(true); setShowAccount(false); setShowOrders(false); }} className="navbar-brand" href="#">Products</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a onClick={() => { setShowProducts(false); setShowAccount(false); setShowOrders(true); }} className="nav-link active" href="#">My Orders</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => { setShowProducts(false); setShowAccount(true); setShowOrders(false); }} className="nav-link" href="#">My Account</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => navigate('/')} className="nav-link" href="#">Log Out</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <br />
      </div>




      
      {showProducts && (
  <div>
    <SearchBox onFilter={handleFilter} /> 

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div style={{ textAlign: 'left', width: '400px' }}> 
        {filteredProducts.map((product) => {

          // Calculate the total quantity bought by allowed users for each product
          const totalBoughtByAllowedUsers = users.reduce((total, user) => {
            if (user.isAllowedOrders) {
              const boughtProduct = user.productsBought.find(p => p.name.toLowerCase() === product.name.toLowerCase());

              //ensuring 'qty' is a number
              return total + (boughtProduct ? parseInt(boughtProduct.qty, 10) : 0);
            }
            return total;
          }, 0);

          return (
            <div key={product.id} style={{ width: '100%', marginBottom: '20px' }}>
              <div className="product-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <div style={{ flex: 2 }}>
                  <strong>{product.name}</strong><br />
                  {product.description}<br />
                  Price: {product.price}<br />
                  In Stock: {product.stock}
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <button onClick={() => decreaseProduct(product.id)} className="btn btn-cancel" style={{ fontSize: '0.8rem', padding: '5px 10px', margin: '0 5px' }}>-</button>
                    <p style={{ margin: '0 10px', fontWeight: 'bold' }}>{product.qty}</p>
                    <button onClick={() => increaseProduct(product.id)} className="btn btn-cancel" style={{ fontSize: '0.8rem', padding: '5px 10px', margin: '0 5px' }}>+</button>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <img src={product.link} alt="product image" style={{ width: '150px', height: '100px', marginLeft: '20px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginLeft: '10px' }}>
                  Bought: {totalBoughtByAllowedUsers}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>


          <div>
            {/* Open Cart Button */}
            {!open && (
              <IconButton
                onClick={toggleCart}
                style={{
                  position: 'fixed',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1300,
                  color: '#000',
                  fontSize: '2rem',
                }}
              >
                <ArrowForward />
              </IconButton>
            )}

            {/* Swipeable Cart Drawer */}
            <SwipeableDrawer
              anchor="left"
              open={open}
              onClose={toggleCart}
              onOpen={() => {}}
              style={{ width: '400px' }}
              PaperProps={{
                style: {
                  width: '400px',
                  borderTopRightRadius: '20px',
                  borderBottomRightRadius: '20px',
                },
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '10px',
                  alignItems: 'center',
                }}
              >
                {/* Close Cart Button */}
                <IconButton
                  onClick={toggleCart}
                  style={{
                    color: '#000',
                    fontSize: '2rem',
                    position: 'relative',
                    top: '0',
                    right: '0',
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </div>
              <Divider />
              <div style={{ padding: '20px' }}>
  <h2>Cart </h2>
  {currentUser.productsBought.length === 0 ? (
    <p>Your cart is empty</p>
  ) : (
    currentUser.productsBought.map((product, index) => {
      const price = parseFloat(product.price.replace('$', ''));
      const total = price * product.qty;
      return (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
            justifyContent: 'space-between'
          }}
          className='form-control'
        >
          <p style={{ flex: 1, margin: '0' }}>{product.name}</p>
          
          <button onClick={() => increaseProduct(product.id)} className="btn btn-cancel" style={{ fontSize: '0.8rem', padding: '5px 10px', margin: '0 5px' }}>+</button>
          
          <strong><p style={{ margin: '0 10px' }}>{product.qty}</p></strong>
          
          <button onClick={ () => decreaseProduct(product.id)} className="btn btn-cancel" style={{ fontSize: '0.8rem', padding: '5px 10px', margin: '0 5px' }}>-</button>
          
          <p style={{ margin: '0 10px' }}>Total: ${total.toFixed(0)}</p>
          
          <button onClick={() => removeProduct(product.id)} className="btn btn-delete" style={{ fontSize: '0.8rem', padding: '5px 10px', margin: '0 5px' }}>X</button>
        </div>
      );
    })
  )}
                <div style={{ fontWeight: 'bold' }}><br/>
                  <p>Total: ${totalPrices.toFixed(0)}</p>
                  <button onClick={handleOrder} className="btn btn-add">Order</button>
                </div>
              </div>
            </SwipeableDrawer>
          </div>
        </div>
      )}

      {showOrders && (
        <div className="form-control">
          <h1 className="title">Orders</h1>
          <Tables 
            data={currentUser.productsBought.map(item => {
              const priceWithoutSymbol = item.price.replace('$', ''); 
              const total = Number(priceWithoutSymbol) * item.qty;
              const formattedTotal = `$${total.toFixed(0)}`; 
              return {
                ...item,
                total: formattedTotal 
              };
            })}
            columns={[
              { key: 'name', label: 'Title' },
              { key: 'qty', label: 'Qty' },
              { key: 'date', label: 'Date' },
              { key: 'total', label: 'Total' } 
            ]}
          />  
        </div>
      )}

      {showAccount && (
        <div className="register-container">
          First Name:<br />
          <input type="text" className="form-control" value={updatedUser.firstName} onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} /><br />
          Last Name:<br />
          <input type="text" className="form-control" value={updatedUser.lastName} onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} /><br />
          User Name:<br />
          <input type="text" className="form-control" value={updatedUser.username} onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })} /><br />
          Password:<br />
          <input type="password" className="form-control" value={updatedUser.password} onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })} /><br />
          <button onClick={saveChanges} className="btn-login btn-add">Save</button>
        </div>
      )}
    </div>
  );
};

export default UserConsole;

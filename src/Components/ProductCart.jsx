import React, { useState } from 'react';
import { SwipeableDrawer, IconButton, Divider } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
const SwipeableCart = () => {
  const [open, setOpen] = useState(false);
  const currentUser = useSelector((state) => state.users.currentUser);
  const counter=0
  const toggleCart = () => {
    setOpen(!open);
  };

  return (
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
        style={{ width: '300px' }}
        PaperProps={{
          style: {
            width: '300px',
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            width:'400px',
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
        <h2>Cart</h2>
          <div className='form-control'>
            <p>{currentUser.productsBought.name}</p>
            <button onClick={() => counter=counter+1}>+</button>
            <p>{counter}</p>
            <button onClick={() => counter=counter-1}>-</button>
            units - Total:
            <button className='btn-delete '>X</button>
            </div>
          
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default SwipeableCart;

const initialState = {
  users: [],
  currentUser: {}, 
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_USERS': {
      return { ...state, users: action.payload };
    }
    case 'ADD_USER': {
      return { ...state, users: [...state.users, action.payload] };
    }
    case 'UPDATE_USER': {
      const users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
      return { ...state, users };
    }
    case 'DELETE_USER': {
      const users = state.users.filter((user) => user.id !== action.payload);
      return { ...state, users };
    }
    case 'SET_CURRENT_USER': {
      return { ...state, currentUser: action.payload };
    }

    case 'INCREASE_PRODUCT': {
      const updatedUsers = state.users.map((user) => {
        if (user.id === action.payload.userId) {
          return {
            ...user,
            productsBought: user.productsBought.map((product) => {
              if (product.id === action.payload.productId) {
                // Ensure the qty is treated as a number
                const updatedQty = parseInt(product.qty, 10) + 1;
                return { ...product, qty: updatedQty };
              }
              return product;
            }),
          };
        }
        return user;
      });
    
      const updatedCurrentUser = updatedUsers.find(user => user.id === state.currentUser.id);
    
      return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    

    case 'DECREASE_PRODUCT': {
      const updatedUsers = state.users.map((user) => {
        if (user.id === action.payload.userId) {
          return {
            ...user,
            productsBought: user.productsBought.map((product) => {
              if (product.id === action.payload.productId) {
                const updatedQty = Math.max(parseInt(product.qty, 10) - 1, 0); // Ensure qty doesn't go below 0
                return { ...product, qty: updatedQty };
              }
              return product;
            }),
          };
        }
        return user;
      });
    
      const updatedCurrentUser = updatedUsers.find(user => user.id === state.currentUser.id);
    
      return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    

    case 'REMOVE_PRODUCT': {
      const updatedUsers = state.users.map((user) => {
        if (user.id === action.payload.userId) {
          return {
            ...user,
            productsBought: user.productsBought.filter(
              (product) => product.id !== action.payload.productId // Remove the product from the array
            ),
          };
        }
        return user;
      });
    
      const updatedCurrentUser = updatedUsers.find(user => user.id === state.currentUser.id);
    
      return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    

    default:
      return state;
  }
};

export default usersReducer;

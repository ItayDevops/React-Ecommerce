
const initialState = {
  products: []
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_products': {
      return { ...state, products: action.payload };
    }
    case 'ADD_product': {
      return { ...state, products: [...state.products, action.payload] };
    }
    case 'UPDATE_product': {
      const products = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      return { ...state, products };
    }
    case 'DELETE_product': {
      const products = state.products.filter((product) => product.id !== action.payload);
      return { ...state, products };
    }
    default:
      return state;
  }
};

export default productsReducer;

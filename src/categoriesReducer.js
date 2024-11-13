const initialState = {
  categories: []
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD': {
      return { ...state, categories: action.payload }; 
    }
    case 'ADD': {
      return { ...state, categories: [...state.categories, action.payload] };
    }
    case 'UPDATE': {
      const categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
      return { ...state, categories };
    }
    case 'DELETE': {
      const categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      return { ...state, categories };
    }
    default:
      return state;
  }
};

export default categoriesReducer;

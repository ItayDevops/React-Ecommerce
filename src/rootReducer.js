import { combineReducers } from 'redux';
import categoriesReducer from './categoriesReducer';
import usersReducer from './usersReducer';
import productsReducer from './productsReducer';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  users: usersReducer,
  products:productsReducer
});

export default rootReducer;

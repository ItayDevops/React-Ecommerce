import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer.js';
import './index.scss';

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

export { store };

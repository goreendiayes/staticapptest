import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

export const store = createStore(
  combineReducers({
    ...reducers,
  }),
  compose(
    applyMiddleware(thunk),
    // uncomment this line out if you're using redux dev tools in chrome
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
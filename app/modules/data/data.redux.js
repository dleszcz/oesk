import { createActions, createReducer } from 'reduxsauce';
import { Record, Map, fromJS } from 'immutable';

export const { Types: DataTypes, Creators: DataActions } = createActions({
  watch: [],
  init: [],
  setItems: ['data'],
  setCurrentResult: ['data'],
}, { prefix: 'DATA_' });

//eslint-disable-next-line
const DataInitialState = Record({
  initialized: false,
  items: Map(),
  currentResult: Map(),
});

const INITIAL_STATE = new DataInitialState();

const setItems = (state, { data }) => state
  .set('items', fromJS(data));

const init = (state) => state
  .set('initialized', true);

const setCurrentResult = (state, { data }) => state
  .set('currentResult', fromJS(data));

export const reducer = createReducer(INITIAL_STATE, {
  [DataTypes.SET_ITEMS]: setItems,
  [DataTypes.SET_CURRENT_RESULT]: setCurrentResult,
  [DataTypes.INIT]: init,
});

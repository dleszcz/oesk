import { createActions, createReducer } from 'reduxsauce';
import { Record, Map, fromJS } from 'immutable';

export const { Types: DataTypes, Creators: DataActions } = createActions({
  watch: [],
  init: [],
  setItems: ['data'],
  pushItem: ['data'],
}, { prefix: 'DATA_' });

//eslint-disable-next-line
const DataInitialState = Record({
  initialized: false,
  items: Map(),
});

const INITIAL_STATE = new DataInitialState();

const setItems = (state, { data }) => state
  .set('items', data);

const init = (state) => state
  .set('initialized', true);

export const reducer = createReducer(INITIAL_STATE, {
  [DataTypes.SET_ITEMS]: setItems,
  [DataTypes.INIT]: init,
});

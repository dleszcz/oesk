import { createSelector } from 'reselect';

export const selectData = state => state.get('data');

export const selectItems = createSelector(
  selectData,
  state => state.get('items'),
);

export const selectInitialized = createSelector(
  selectData,
  state => state.get('initialized'),
);

/**
 * FilterForm selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectCurrency = () =>
  createSelector(
    selectHome,
    homeState => homeState.currency,
  );

export { selectHome, makeSelectCurrency };

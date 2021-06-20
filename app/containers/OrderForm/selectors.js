/**
 * SearchForm selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectArtNumber = () =>
  createSelector(
    selectHome,
    homeState => homeState.artNumber,
  );

export { selectHome, makeSelectArtNumber };

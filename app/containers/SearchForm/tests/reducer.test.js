import produce from 'immer';

import searchReducer from '../reducer';
import { changeArtNumber } from '../actions';

/* eslint-disable default-case, no-param-reassign */
describe('searchReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      username: '',
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(searchReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the changeArtNumber action correctly', () => {
    const fixture = 'mxstbr';
    const expectedResult = produce(state, draft => {
      draft.username = fixture;
    });

    expect(searchReducer(state, changeArtNumber(fixture))).toEqual(expectedResult);
  });
});

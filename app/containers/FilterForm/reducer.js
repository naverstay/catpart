/*
 * filterReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { CHANGE_CURRENCY } from './constants';

// The initial state of the App
export const initialState = {
  currency: 'RUB',
};

/* eslint-disable default-case, no-param-reassign */
const filterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_CURRENCY:
        // Delete prefixed '@' from the github currency
        draft.currency = action.currency;
        break;
    }
  });

export default filterReducer;

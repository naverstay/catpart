/*
 * searchReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from "immer";
import { CHANGE_ARTNUMBER } from "./constants";

// The initial state of the App
export const initialState = {
  artNumber: ""
};

/* eslint-disable default-case, no-param-reassign */
const searchReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_ARTNUMBER:
        // Delete prefixed '@' from the github artNumber
        draft.artNumber = action.artNumber.replace(/@/gi, "");
        break;
    }
  });

export default searchReducer;

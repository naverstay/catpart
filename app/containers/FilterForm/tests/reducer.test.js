import produce from "immer";

import filterReducer from "../reducer";
import { changeUsername } from "../actions";

/* eslint-disable default-case, no-param-reassign */
describe("filterReducer", () => {
  let state;
  beforeEach(() => {
    state = {
      username: ""
    };
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(filterReducer(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the changeUsername action correctly", () => {
    const fixture = "mxstbr";
    const expectedResult = produce(state, draft => {
      draft.username = fixture;
    });

    expect(filterReducer(state, changeUsername(fixture))).toEqual(expectedResult);
  });
});

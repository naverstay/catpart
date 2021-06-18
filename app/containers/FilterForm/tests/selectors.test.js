import { selectHome, makeSelectCurrency } from "../selectors";

describe("selectHome", () => {
  it("should select the home state", () => {
    const homeState = {
      userData: {}
    };
    const mockedState = {
      home: homeState
    };
    expect(selectHome(mockedState)).toEqual(homeState);
  });
});

describe("makeSelectCurrency", () => {
  const usernameSelector = makeSelectCurrency();
  it("should select the username", () => {
    const username = "mxstbr";
    const mockedState = {
      home: {
        username
      }
    };
    expect(usernameSelector(mockedState)).toEqual(username);
  });
});

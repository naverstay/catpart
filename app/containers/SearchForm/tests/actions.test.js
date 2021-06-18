import { CHANGE_ARTNUMBER } from '../constants';

import { changeUsername } from '../actions';

describe('Home Actions', () => {
  describe('changeUsername', () => {
    it('should return the correct type and the passed name', () => {
      const fixture = 'Max';
      const expectedResult = {
        type: CHANGE_ARTNUMBER,
        username: fixture,
      };

      expect(changeUsername(fixture)).toEqual(expectedResult);
    });
  });
});

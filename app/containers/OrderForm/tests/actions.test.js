import { CHANGE_ARTNUMBER } from '../constants';

import { changeArtNumber } from '../actions';

describe('Home Actions', () => {
  describe('changeArtNumber', () => {
    it('should return the correct type and the passed name', () => {
      const fixture = 'Max';
      const expectedResult = {
        type: CHANGE_ARTNUMBER,
        username: fixture,
      };

      expect(changeArtNumber(fixture)).toEqual(expectedResult);
    });
  });
});

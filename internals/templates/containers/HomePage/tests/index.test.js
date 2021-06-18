import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import SearchForm from '../index';

describe('<SearchForm />', () => {
  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <SearchForm />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});

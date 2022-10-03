/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectArtNumber } from 'containers/SearchForm/selectors';

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const artNumber = yield select(makeSelectArtNumber());
  //const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;
  const requestURL = `http://dev.catpart.ru/api/search`;

  let options = {
    q: artNumber,
    c: 1,
  };

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL, options);
    yield put(reposLoaded(repos, artNumber));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_REPOS, getRepos);
}

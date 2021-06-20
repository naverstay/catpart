import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  console.log('parseJSON', response);

  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.data;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  console.log('checkStatus', response);

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {function} cb        Tha callback function
 *
 * @return {object}           The response data
 */

export default function searchRequest(url, options, cb) {
  if (typeof cancel === 'function') {
    cancel();
    cancel = null;

    if (typeof cb === 'function') {
      cb([]);
    }

    console.log('canceled', cancel);
  }

  return axios(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {},
    params: options,
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    }),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (typeof cb === 'function') {
        cb(data);
      }
    });
}

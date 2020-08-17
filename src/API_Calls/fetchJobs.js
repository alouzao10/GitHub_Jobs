import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTION = {
  MAKE_REQUEST: 'make-request',
  GET: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NXTPAGE: 'has_nxtpage',
};

const BASE_URL =
  'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

function reducer(state, action) {
  // Called when we execute dispatch
  // State is the current state
  // Action holds what action to execute on state
  // action.payload.x to capture values
  // action.type to capture what action to take
  switch (action.type) {
    case ACTION.MAKE_REQUEST:
      // loading the new set of jobs and clear the jobs list
      return { loading: true, jobs: [] };
    case ACTION.GET:
      // return the existing state and append new values as a result of the GET
      // Use the jobs that are passed in as payload
      return { ...state, loading: false, jobs: action.payload.jobs };
    case ACTION.ERROR:
      return {
        ...state,
        loading: false,
        jobs: [],
        error: action.payload.error,
      };
    case ACTION.UPDATE_HAS_NXTPAGE:
      // loading the new set of jobs and clear the jobs list
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
}

export default function FetchJobs(params, page) {
  // Create the default state
  const [state, dispatch] = useReducer(reducer, {
    jobs: [],
    loading: true,
  });

  // Execute when params or page values update
  useEffect(() => {
    // Cancel token to terminate request
    const cancelToken = axios.CancelToken.source();
    const cancelToken2 = axios.CancelToken.source();

    // Make a request on a new page
    dispatch({ type: ACTION.MAKE_REQUEST });
    // Make a call to the API
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => {
        // Return the Data from the API and set the state
        dispatch({ type: ACTION.GET, payload: { jobs: res.data } });
      })
      .catch((e) => {
        // Catch any errors as a result of the fetch
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTION.ERROR, payload: { error: e } });
      });

    // Check if there is more than one page
    axios
      .get(BASE_URL, {
        cancelToken2: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => {
        // Return the Data from the API and set the state
        dispatch({
          type: ACTION.UPDATE_HAS_NXTPAGE,
          payload: { hasNextPage: res.data.length !== 0 },
        });
      })
      .catch((e) => {
        // Catch any errors as a result of the fetch
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTION.ERROR, payload: { error: e } });
      });

    return () => {
      cancelToken.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  //dispatch({ type: 'hello', payload: { x: 3 } }); // Call the action and pass values

  return state;
}

import { useReducer } from "react";

const LOADING = "loading";
const IDLE = "idle";
const REJECTED = "rejected";
const RESOLVED = "resolved";

const initialState = {
  status: "idle",
  errors: null,
};

function reducer(state, action) {
  if (action.type === IDLE) {
    return { ...state, status: IDLE, errors: null };
  }

  if (action.type === LOADING) {
    return { ...state, status: LOADING };
  }

  if (action.type === REJECTED) {
    return { ...state, status: REJECTED, errors: action.payload };
  }

  if (action.type === RESOLVED) {
    return { ...state, status: RESOLVED };
  }

  throw new Error(`Invalid action type: ${action.type}`);
}

function useAuthReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setLoading() {
    dispatch({ type: LOADING });
  }

  function setIdle() {
    dispatch({ type: IDLE });
  }

  function setErrors(errors) {
    dispatch({ type: REJECTED, payload: errors });
  }

  function setResolved() {
    dispatch({ type: RESOLVED });
  }

  return [state, { setLoading, setErrors, setResolved, setIdle }];
}

export { useAuthReducer };

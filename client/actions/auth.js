import moment from "moment";
import cookie from "react-cookie";
import { browserHistory } from "react-router";

export function login(email, password) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "LOGIN_SUCCESS",
            token: json.token,
            user: json.user
          });
          cookie.save("token", json.token, {
            path: "/",
            expires: moment().add(1, "hour").toDate()
          });
          browserHistory.push("/account");
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "LOGIN_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function signup(name, email, password) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password })
    }).then(response => {
      return response.json().then(json => {
        if (response.ok) {
          dispatch({
            type: "SIGNUP_SUCCESS",
            token: json.token,
            user: json.user
          });
          browserHistory.push("/");
          cookie.save("token", json.token, {
            path: "/",
            expires: moment().add(1, "hour").toDate()
          });
        } else {
          dispatch({
            type: "SIGNUP_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}

export function logout() {
  cookie.remove("token");
  browserHistory.push("/");
  return {
    type: "LOGOUT_SUCCESS"
  };
}

export function forgotPassword(email) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/forgot", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "FORGOT_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "FORGOT_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function resetPassword(password, confirm, pathToken) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch(`/api/users/reset/${pathToken}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          browserHistory.push("/login");
          dispatch({
            type: "RESET_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "RESET_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function updateProfile(state, token) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/account", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: state.email,
        name: state.name,
        gender: state.gender,
        location: state.location,
        website: state.website
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "UPDATE_PROFILE_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "UPDATE_PROFILE_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword(password, confirm, token) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/account", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "CHANGE_PASSWORD_SUCCESS",
            messages: [json]
          });
        });
      } else {
        return response.json().then(json => {
          dispatch({
            type: "CHANGE_PASSWORD_FAILURE",
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteAccount(token) {
  return dispatch => {
    dispatch({
      type: "CLEAR_MESSAGES"
    });
    return fetch("/api/users/account", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch(logout());
          dispatch({
            type: "DELETE_ACCOUNT_SUCCESS",
            messages: [json]
          });
        });
      }
    });
  };
}

export function hydrateUserFromToken() {
  return dispatch => {
    return fetch("/api/users/me", {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    }).then(response => {
      if (response.ok) {
        return response.json().then(json => {
          dispatch({
            type: "nashjobs/auth/hydrateUserFromToken",
            payload: json.data,
            token: json.token
          });
        });
      }
    });
  };
}

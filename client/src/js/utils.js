import axios from "axios";

export function getUrl(route) {
  const url = `http://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_SERVER_PORT}/${route}`;
  return url;
}

export function loggedIn() {
  return axios
    .get(getUrl("api/loggedin"))
    .then(() => true)
    .catch(() => false);
}

export function logOut() {
  const token = localStorage.getItem("token");
  localStorage.setItem("token", null);
  return axios.get(getUrl(`api/logout/${token}`));
}

export function getUrl(route) {
  const url = `http://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_SERVER_PORT}/${route}`;
  console.log(url);
  return url;
}

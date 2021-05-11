export default function ({ $axios }) {
  $axios.onRequest(() => {
    $axios.setHeader('Authorization', localStorage.getItem("token"))
  })
}

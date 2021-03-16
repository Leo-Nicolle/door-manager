import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.send(200);
});

// if (require.main === module) { // true if file is executed
//   app.listen(5555, () => {
//     console.log(`server started at http://localhost:${5555}`);
//   });
// }
export default app;

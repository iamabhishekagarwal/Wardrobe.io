import express from 'express';
const app = express();
const port = 5172;


app.use(express.json());



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


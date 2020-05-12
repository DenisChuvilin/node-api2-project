//start express
const express = require('express');
const server = express();
const router = require('./routers/ExpressRouter');

server.use(express.json());

// import router
server.use('/api/posts', router);

server.get('/', (req, res) => {
  res.send({ message: 'Backend Node project 2' });
});

server.listen(8000, () => {
  console.log(
    '------------------------------------------\nserver is running on http://localhost:8000\n------------------------------------------ '
  );
});

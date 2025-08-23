import { Request, Response } from 'express';

const express = require('express');
const app = express();
const PORT = 8080;

app.listen(
  PORT,
  () => console.log(`Server running on http://localhost:8080`)
)

// Middleware!
app.use( express.json() )

app.get('/tshirt', (req: Request, res: Response) => {
  res.status(200).send({
    tshirt: '👕',
    size: 'large'
  })
});

// Generic endpoint using :id
app.post('/tshirt/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { logo } = req.body;

  if (!logo) {
    res.status(418).send({
      message: 'We need a logo!'
    })
  }

  res.send({
    tshirt: `👕 with your ${logo} and ID of ${id}`
  })
});
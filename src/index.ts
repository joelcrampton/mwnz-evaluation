import axios from 'axios';
import express, { Request, Response } from 'express';
import { parseStringPromise } from 'xml2js';

const app = express();
const PORT = 8080;
const BASE_URL = 'https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api';

app.listen(
  PORT,
  () => console.log(`Server running on http://localhost:8080`)
)

// Middleware!
app.use( express.json() )

// Generic using :id
app.get('/v1/companies/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const company = await getCompanyById(id!); // ! = non-null assertion
    res.set('Content-Type', 'application/xml');
    res.send(company);
  } catch (error: any) {
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'Not Found',
        error_description: `Company with ID ${id} not found`
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        error_description: error.message
      });
    }
  }
});

async function getCompanyById(id: string): Promise<any> {
  const url = `${BASE_URL}/${id}.xml`;
  const response = await axios.get(url, { responseType: 'text' });
  
  const json = await parseStringPromise(response.data);
  const data = json.Data;

  return {
    id: parseInt(data.id[0]),
    name: data.name[0],
    description: data.description[0]
  };
}
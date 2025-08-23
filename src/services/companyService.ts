import axios from 'axios';
import { parseStringPromise }  from 'xml2js';
import { Company } from '../types/index';

const BASE_URL = 'https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api';

/**
 * Get a Company using the given id.
 *
 * @param id - The id.
 * @returns The Company
 */
export async function getCompanyById(id: string): Promise<Company> {
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
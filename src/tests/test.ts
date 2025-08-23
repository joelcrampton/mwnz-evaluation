import { getCompanyById } from '../services/companyService';

describe('Server', () => {
  it('should fetch and parse company with ID 1', async () => {
    const id = '1';
    const company = await getCompanyById(id);
    expect(company).toEqual({
      id: 1,
      name: 'MWNZ',
      description: '..is awesome'
    });
  });
  
  it('should throw for invalid company ID', async () => {
    const id = 'invalid';
    await expect(getCompanyById(id)).rejects.toThrow();
  });
});
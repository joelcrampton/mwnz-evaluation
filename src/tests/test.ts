import { getCompanyById } from '../services/companyService';

describe('Server', () => {
  // Valid test for getCompanyById
  it('should fetch and parse company with ID 1', async () => {
    const company = await getCompanyById('1');
    expect(company).toEqual({
      id: 1,
      name: 'MWNZ',
      description: '..is awesome'
    });
  });

  // Invalid test for getCompanyById
  it('should throw for invalid company ID', async () => {
    await expect(getCompanyById('invalid')).rejects.toThrow();
  });
});
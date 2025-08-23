const getCompanyById = require('../server');

describe('Server', () => {
  it('should fetch and parse company with ID 1', async () => {
    const company = await getCompanyById('1');
    expect(company).toEqual({
      id: 1,
      name: 'MWNZ',
      description: '..is awesome'
    });
  });

  it('should throw for invalid company ID', async () => {
    await expect(getCompanyById('3')).rejects.toThrow();
  });
});
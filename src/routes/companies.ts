import { Router, Request, Response } from 'express';
import { getCompanyById } from '../services/companyService';

const router = Router();

// Generic using :id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const company = await getCompanyById(id!); // ! = non-null assertion
    res.json(company);
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

export default router;
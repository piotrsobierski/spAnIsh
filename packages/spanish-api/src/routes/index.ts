import { Router } from 'express';

export const router = Router();

// Example route
router.get('/example', (req, res) => {
  /* 
    #swagger.tags = ['Example']
    #swagger.description = 'Example endpoint'
  */
  res.json({ message: 'Example endpoint' });
}); 
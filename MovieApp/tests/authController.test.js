import { showLoginForm, showRegisterForm } from '../controllers/authController.js';
import { jest } from '@jest/globals';

describe('Form endpoints', () => {
  let req, res;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('showLoginForm returns correct response', async () => {
    await showLoginForm(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login form endpoint (for frontend use)' });
  });

  test('showRegisterForm returns correct response', async () => {
    await showRegisterForm(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Register form endpoint (for frontend use)' });
  });
});

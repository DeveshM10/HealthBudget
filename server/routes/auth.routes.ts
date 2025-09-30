import { Router } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { validateRequest } from '../middleware/validate-request';
import { catchAsync } from '../utils/error';

const router = Router();

// Register a new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role').isIn(['patient', 'doctor']).withMessage('Invalid role'),
  ],
  validateRequest,
  catchAsync(async (req, res) => {
    const user = await AuthService.register({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      phone: req.body.phone,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  })
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').exists().withMessage('Password is required'),
  ],
  validateRequest,
  catchAsync(async (req, res) => {
    const { user, token, sessionId } = await AuthService.login({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.get('user-agent') || '',
      ipAddress: req.ip,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token,
        sessionId,
      },
    });
  })
);

// Logout user
router.post(
  '/logout',
  catchAsync(async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // In a real app, you would invalidate the token on the server
      // For now, we'll just clear the cookie
      res.clearCookie('token');
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  })
);

// Get current user
router.get(
  '/me',
  catchAsync(async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(200).json({
        status: 'success',
        data: {
          user: null,
        },
      });
    }

    try {
      const user = await AuthService.getUserFromToken(token);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      // Clear invalid token
      res.clearCookie('token');
      res.status(200).json({
        status: 'success',
        data: {
          user: null,
        },
      });
    }
  })
);

// Change password
router.post(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long'),
  ],
  validateRequest,
  catchAsync(async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedError('You are not logged in');
    }

    const user = await AuthService.getUserFromToken(token);
    
    await AuthService.changePassword(
      user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  })
);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  catchAsync(async (req, res) => {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);

    // Always return success to prevent email enumeration
    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, you will receive a password reset link',
    });
  })
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  catchAsync(async (req, res) => {
    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  })
);

export { router as authRouter };

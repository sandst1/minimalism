import { Router, Request, Response } from 'express';
import { database } from '../services/database';
import { CreateUserRequest, ApiResponse, User } from '../types';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/users - Get all users
router.get('/', asyncHandler(async (req: Request, res: Response<ApiResponse<User[]>>) => {
  const users = database.getAllUsers();
  res.json({
    success: true,
    data: users,
    message: `Retrieved ${users.length} users`
  });
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<User>>) => {
  const { id } = req.params;
  const user = database.getUserById(id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
}));

// POST /api/users - Create new user
router.post('/', asyncHandler(async (req: Request<{}, ApiResponse<User>, CreateUserRequest>, res: Response<ApiResponse<User>>) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new AppError('Email and name are required', 400);
  }

  // Check if user with email already exists
  const existingUser = database.getUserByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const user = database.createUser({ email, name });

  res.status(201).json({
    success: true,
    data: user,
    message: 'User created successfully'
  });
}));

// PUT /api/users/:id - Update user
router.put('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<User>>) => {
  const { id } = req.params;
  const { email, name } = req.body;

  if (!email && !name) {
    throw new AppError('At least one field (email or name) is required for update', 400);
  }

  // Check if user exists
  const existingUser = database.getUserById(id);
  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // If email is being updated, check for conflicts
  if (email && email !== existingUser.email) {
    const userWithEmail = database.getUserByEmail(email);
    if (userWithEmail) {
      throw new AppError('User with this email already exists', 409);
    }
  }

  const updatedUser = database.updateUser(id, { email, name });

  res.json({
    success: true,
    data: updatedUser,
    message: 'User updated successfully'
  });
}));

// DELETE /api/users/:id - Delete user
router.delete('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
  const { id } = req.params;

  const user = database.getUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const deleted = database.deleteUser(id);
  
  if (!deleted) {
    throw new AppError('Failed to delete user', 500);
  }

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

export default router;

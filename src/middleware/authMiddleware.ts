import { Request, Response, NextFunction } from 'express'
import User from '../models/userModels'
import { verifyToken } from '../utlis/authUtils'
import { CustomJwtPayload } from '../types/authTypes' 

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      res.status(401).json({ message: 'Authorization token required' })
      return
    }

    const decoded = verifyToken(token) as CustomJwtPayload

    const user = await User.findById(decoded.userId)
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    req.user = user
    req.userId = user.id.toString()

    next()
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token',
      error: (error as Error).message,
    })
  }
}


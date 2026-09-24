import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from './user.model.js';
import { env } from '../../config/env.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors/AppError.js';
import { UserIdentity } from '../../shared/types/auth.js';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: UserIdentity; token: string }> {
    const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const user = await UserModel.create({
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<{ user: UserIdentity; token: string }> {
    const user = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async getUserById(userId: string): Promise<UserIdentity> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }

  generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): UserIdentity {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserIdentity;
      return decoded;
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }
  }
}

export const authService = new AuthService();

import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import {DataSource } from 'typeorm';
import { User } from '../model/userModel';
config()

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {Secret} from "jsonwebtoken";
import {connectionOptions} from "../typeorm-config";
const tokenKey: Secret = process.env.TOKEN_KEY || '';

let dataSource: DataSource;

async function connectToDatabase(): Promise<void> {
  try {
    dataSource = new DataSource(connectionOptions);
    await dataSource.initialize();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}
connectToDatabase()


const validateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token
  const token = req.headers.authorization || req.query.token || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token
  const newToken: string = token as any
  const slicedToken: string = newToken.slice(7)
  jwt.verify(slicedToken, tokenKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  });
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send('All inputs are required');
    }

    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {user_id: user.id, email},
        tokenKey,
        {
          expiresIn: '2h',
        }
      );

      const returnedUser = {
        token: token,
        email: user.email,
        id: user.id,
        password: user.password,
      };

      return res.status(200).json(returnedUser);
    }

    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send('All inputs are required');
    }
    const userRepository = dataSource.getRepository(User);
    const oldUser = await userRepository.findOne({ where: { email } });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(
      email.toLowerCase(),
      encryptedPassword
    );

    console.log('user', user);

    const token = jwt.sign(
      {user_id: user.id, email},
      tokenKey,
      {
        expiresIn: '2h',
      }
    );

    const returnedUser = {
      token: token,
      email: user.email,
      id: user.id,
      password: user.password,
    };

    return res.status(201).json(returnedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (email: string, password: string) => {
  try {
    const user = new User();
    user.email = email;
    user.password = password;

    const userRepository = dataSource.getRepository(User);
    await userRepository.save(user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { validateToken, login, register };

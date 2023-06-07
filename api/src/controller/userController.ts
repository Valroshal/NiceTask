import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import {DataSource, DataSourceOptions, getRepository} from 'typeorm';
import { User } from '../model/userModel';
config()

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {Secret} from "jsonwebtoken";
const tokenKey: Secret = process.env.TOKEN_KEY || '';



let dataSource: DataSource;

async function connectToDatabase(): Promise<void> {
  try {
    const connectionOptions: DataSourceOptions = {
      type: 'postgres',
      host: 'abul.db.elephantsql.com',
      port: 5432,
      username: 'elddwomh',
      password: 'skgUevkZBiCtyZndoLUMgKK_NPDC90aD',
      database: 'elddwomh',
      synchronize: true,
      logging: true,
      entities: [User],
    };

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
  // Get the token from the request headers, query parameters, or cookies
  const token = req.headers.authorization || req.query.token || req.cookies.token;
  console.log('token', token)
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

    // If the token is valid, you can access the decoded data in `decoded` object
    //req.userId = decoded.user_id; TODO here is the bug in userId

    next();
  });
};

const login = async (req: Request, res: Response) => {
  console.log('login called')
  try {
    const { email, password } = req.body;
    console.log('req.body', req.body)

    if (!(email && password)) {
      return res.status(400).send('All inputs are required');
    }

    const userRepository = dataSource.getRepository(User);
    console.log('userRepository', userRepository)

    const user = await userRepository.findOne({ where: { email } });
    console.log('user', user)

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
    console.log('before fetching user')
    const userRepository = dataSource.getRepository(User);
    console.log('after fetching user')
    const oldUser = await userRepository.findOne({ where: { email } });

    if (oldUser) {
      console.log('oldUser', oldUser);
      return res.status(409).send('User Already Exist. Please Login');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log('encryptedPassword', encryptedPassword)
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

    console.log('returnedUser', returnedUser);
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
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { validateToken, login, register };

import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

const secret = 'SJKWWRTSssawrscwtsaaqwr';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  function authenticate() {
    const { userName, password } = req.body;
    const token = jwt.sign({ sub: '1', uid: '1', uname: userName, roles: [] }, secret, {
      expiresIn: '7d'
    });
    // return basic user details and token
    return res.status(200).json({
      token
    });
  }
  switch (req.method) {
    case 'POST':
      return authenticate();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

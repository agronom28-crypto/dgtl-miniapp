import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectRoot = path.join(process.cwd(), '..');
  exec(`cd ${projectRoot} && git checkout -- . && git pull origin master`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message, stderr });
    }
    res.status(200).json({ success: true, stdout, stderr, message: 'Git checkout + pull completed' });
  });
}

import { NextApiRequest, NextApiResponse } from 'next';

const projects = ['Project 1', 'Project 2', 'Project 3'];

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ projects });
};

export default handler;

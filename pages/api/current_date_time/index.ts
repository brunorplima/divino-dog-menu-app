import { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {
   const date = new Date()
   res.status(200).json({ date })
}

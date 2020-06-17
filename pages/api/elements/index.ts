import { NextApiRequest, NextApiResponse } from 'next'
import ELEMENTS from '../../../chem/literals/elements'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json(ELEMENTS)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
export default handler;

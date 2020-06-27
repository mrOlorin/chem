import MultiThree from '../utils/MultiThree'
import React, { Context } from 'react'

export type MultiThreeContextType = { multiThree: MultiThree };
export const MultiThreeContext: Context<Partial<MultiThreeContextType>> = React.createContext<Partial<MultiThreeContextType>>({});

import { GetStaticProps, GetStaticPaths } from 'next'

import Layout from '../../components/Layout'
import Atom from '../../chem/paricles/Atom'
import React from 'react'
import ParticleBuilderCached from '../../chem/ParticleBuilderCached'
import ISOTOPES from '../../chem/literals/isotopes'
import ElementDetails from '../../components/ElementDetails'

type Props = {
  Z: number
}
type State = {
  atom: Atom
}
export default class extends React.Component<Props, State> {
  public constructor (public props: Props, public context: any) {
    super(props);
    this.state = { atom: ParticleBuilderCached.buildAtom(props.Z, ISOTOPES[props.Z][2]) };
  }

  public render () {
    const { atom } = this.state;
    return (
      <Layout title='Element detail'>
        <ElementDetails atom={atom}/>
      </Layout>
    )
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  for (let Z = 1; Z <= 118; Z++) {
    paths.push({
      params: { Z: '' + Z }
    });
  }
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { Z: (params as any).Z } }
}

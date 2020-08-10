import { GetStaticProps, GetStaticPaths } from 'next'

import Layout from '../../components/Layout'
import Atom from '../../chem/paricles/Atom'
import React, { CSSProperties } from 'react'
import ParticleBuilderCached from '../../chem/ParticleBuilderCached'
import ISOTOPES from '../../chem/literals/isotopes'
import ElementDetails from '../../components/ElementDetails'
import Link from 'next/link'
import ELEMENTS from '../../chem/literals/elements'

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
    const links: Array<JSX.Element> = [];
    const linkStyle: CSSProperties = { fontSize: '.7em', paddingRight: '5px', display: 'inline-block' };
    for (let Z = 1; Z <= 118; Z++) {
      links.push(
        <span key={Z} style={linkStyle}>{atom.nucleus.Z === Z ? ELEMENTS[Z] : <Link href={`/elements/${Z}`}>
          <a>{ELEMENTS[Z]}</a>
        </Link>}</span>
      );
    }
    return (
      <Layout title={atom.nucleus.name}>
        <header>
          <nav>{links}</nav>
        </header>
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

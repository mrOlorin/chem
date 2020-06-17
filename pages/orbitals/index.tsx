import { GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import * as React from 'react'
import { Electron } from '../../chem/paricles/Atom'
import OrbitalListItem from '../../components/OrbitalListItem'

type Props = {
  subLevels: Array<Array<Array<Electron>>>
}
export default class Orbitals extends React.Component {
  public props!: Props;

  public render () {
    const { subLevels } = this.props;
    const itemStyle = {
      display: 'inline-block',
      width: '100px',
      height: '100px',
    };
    const electronsMapper = (electrons: Array<Electron>) =>
      <div key={`${electrons[0].l}-${electrons[0].m}`} style={itemStyle}><OrbitalListItem electrons={electrons}/></div>;

    const orbitalsMapper = (orbitals: Array<Array<Electron>>, i: number) => <div style={{textAlign: 'center'}} key={i}>{orbitals.map(electronsMapper)}</div>;

    const orbitals = subLevels.map(orbitalsMapper);
    return (
      <Layout title="Орбитали">
        <h1>Орбитали</h1>
        {orbitals}
      </Layout>
    )
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const subLevels: Array<Array<Array<Electron>>> = [];
  const n = 4;
  for (let l = 0; l <= n; l++) {
    subLevels[l] = [];
    for (let m = -l; m <= l; m++) {
      subLevels[l].push([{ n: 4, l, m, ms: 0.5 }, { n: 4, l, m, ms: -0.5 }]);
    }
  }
  return { props: { subLevels } }
}

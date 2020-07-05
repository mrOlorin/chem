import Layout from '../../components/Layout';
import * as React from 'react';
import { ElectronShell } from '../../chem/paricles/Atom';
import ParticleBuilderCached from '../../chem/ParticleBuilderCached';
import OrbitalList from '../../components/OrbitalList';

type State = {
  subLevels: ElectronShell;
}

export default class Orbitals extends React.Component<void, State> {
  public constructor (public props: any) {
    super(props);
    this.state = { subLevels: ParticleBuilderCached.buildElectronShell(4) };
  }

  public render () {
    const { subLevels } = this.state;
    return (
      <Layout title="Орбитали">
        <h1>Орбитали</h1>
        <OrbitalList subLevels={subLevels}/>
      </Layout>
    )
  }
}

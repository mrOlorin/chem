import * as React from 'react';
import Layout from '../../components/Layout';
import ParticleBuilderCached from '../../chem/ParticleBuilderCached';
import Atom from '../../chem/paricles/Atom';
import ElementList from '../../components/elements/ElementList';

type State = {
  atoms: Array<Atom>;
}
export default class extends React.Component<any, State> {
  public constructor (public props: any, public context: any) {
    super(props);
    this.state = { atoms: ParticleBuilderCached.buildAtoms() };
  }

  public render () {
    const { atoms } = this.state;
    return (
      <Layout title="Элементы">
        <h1>Элементы</h1>
        <ElementList atoms={atoms}/>
      </Layout>
    )
  }
}

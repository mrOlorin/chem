import Layout from '../../components/Layout';
import * as React from 'react';
import NuclideList from '../../components/nuclides/NuclideList';
import ParticleBuilderCached from '../../chem/ParticleBuilderCached';
import Nucleus from '../../chem/paricles/Nucleus';

type Props = void;
type State = {
  isotopes: Array<Nucleus>;
}
export default class Nuclides extends React.Component<Props, State> {

  public constructor (public props: any) {
    super(props);
    this.state = { isotopes: ParticleBuilderCached.buildNuclides() };
  }

  public render () {
    const { isotopes } = this.state;
    return (
      <Layout title="Таблица нуклидов">
        <h1>Таблица нуклидов</h1>
        <p>Скроллить на среднюю кнопку</p>
        <NuclideList nuclides={isotopes}/>
      </Layout>
    )
  }
}

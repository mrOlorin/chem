import { GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import * as React from 'react'
import ISOTOPES from '../../chem/literals/isotopes'
import Atom from '../../chem/paricles/Atom'
import ElementListItem from '../../components/ElementListItem'

type Props = {
  atoms: Array<Atom>
}
export default class Elements extends React.Component {
  public props!: Props;

  public render () {
    const tableBody = () => {
      const elements = [];
      for (let i = 1; i <= 118; i++) {
        elements.push(
          <div key={i} style={{ display: 'inline-block' }}>
            <ElementListItem Z={i}/>
          </div>
        );
      }
      return elements;
    }
    return (
      <Layout title="Элементы">
        <h1>Элементы</h1>
        <div>
          {tableBody()}
        </div>
      </Layout>
    )
  }
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isotopes: ISOTOPES } }
}

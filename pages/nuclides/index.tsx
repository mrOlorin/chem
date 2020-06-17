import Layout from '../../components/Layout'
import * as React from 'react'
import NuclideListItem from '../../components/NuclideListItem'
import ISOTOPES from '../../chem/literals/isotopes'
import { GetStaticProps } from 'next'

type Props = {
  isotopes: Array<[number, number, number]>
}
export default class Nuclides extends React.Component {
  public props!: Props;

  public render () {
    const tableRow = (Z: number, N: [number, number]) => {
      const elements = []
      for (let i = N[0]; i < N[1]; i++) {
        elements.push(<td key={i}><NuclideListItem Z={Z} N={i}/></td>)
      }
      return elements;
    }

    const tableBody = () => {
      const elements = [];
      for (let i = 1, len = this.props.isotopes.length - 1; i <= len; i++) {
        elements.push(<tr key={i}>
          <td colSpan={this.props.isotopes[i][0] + 1}/>
          {tableRow(i, [this.props.isotopes[i][0], this.props.isotopes[i][1]])}</tr>);
      }
      return elements;
    }
    return (
      <Layout title="Таблица нуклидов">
        <h1>Таблица нуклидов</h1>
        <p>Скроллить на среднюю кнопку</p>
        <table>
          <tbody>
          {tableBody()}
          </tbody>
        </table>
      </Layout>
    )
  }
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isotopes: ISOTOPES } }
}

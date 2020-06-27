import React from 'react'
import NuclideListItem from './NuclideListItem'
import Nucleus from '../chem/paricles/Nucleus'

type Props = {
  nuclides: Array<Nucleus>,
}
type State = {
  nuclideRows: Array<Array<Nucleus>>;
}
export default class NuclideList extends React.Component<Props, State> {

  public constructor (public props: any) {
    super(props);
    const { nuclides } = props;

    this.state = { nuclideRows: NuclideList.buildRows(nuclides) }
  }

  private static buildRows (nuclides: Array<Nucleus>): Array<Array<Nucleus>> {
    const nuclideRows: Array<Array<Nucleus>> = [];
    for (const nuclide of nuclides) {
      const i = nuclide.Z - 1;
      if (!nuclideRows[i]) nuclideRows[i] = [];
      nuclideRows[i].push(nuclide);
    }
    return nuclideRows;
  }

  render () {
    const { nuclideRows } = this.state;
    return <table>
      <tbody>{
        nuclideRows.map((nuclideRow, i) =>
          <tr key={i}>
            <td colSpan={nuclideRow[0].N + 1}/>
            {nuclideRow.map((nucleus, j) =>
              <td key={j}>
                <NuclideListItem nucleus={nucleus}/>
              </td>
            )}
          </tr>
        )
      }</tbody>
    </table>
  }
}

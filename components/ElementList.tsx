import React from 'react'
import Atom from '../chem/paricles/Atom'
import ElementListItem from './ElementListItem'

type Props = {
  atoms: Array<Atom>,
}
export default class ElementList extends React.Component<Props> {
  public render () {
    const { atoms } = this.props;

    return atoms.reduce(Atom.byEnergyLevel, []).map((atomsOnLevel, i) =>
      <div key={i}>
        {atomsOnLevel.map((atom, j) =>
          <div key={`${i}-${j}`} style={{ display: 'table-cell' }}>
            <ElementListItem atom={atom}/>
          </div>
        )}
      </div>
    );
  }
}

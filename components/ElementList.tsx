import React from 'react'
import Atom from '../chem/paricles/Atom'
import ElementListItem from './ElementListItem'

type Props = {
  atoms: Array<Atom>,
}
export default class ElementList extends React.Component<Props> {
  render () {
    const { atoms} = this.props;
    return atoms.map(
      (atom, i) =>
        <div key={i} style={{ display: 'inline-block' }}>
          <ElementListItem atom={atom}/>
        </div>
    );
  }
}

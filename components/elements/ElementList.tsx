import React from 'react';
import Atom from '../../chem/paricles/Atom';
import ElementListItem from './ElementListItem';
import Link from 'next/link';

type Props = {
  atoms: Array<Atom>,
}
export default class ElementList extends React.Component<Props> {
  public render () {
    const { atoms } = this.props;

    return atoms.reduce(Atom.byEnergyLevel, []).map((atomsOnLevel, i) =>
      <div key={i} style={{ display: 'table-row' }}>
        {atomsOnLevel.map((atom, j) =>
          <div key={`${i}-${j}`} style={{ display: 'table-cell' }}>
            <Link href="/elements/[Z]" as={`/elements/${atom.nucleus.Z}`}>
              <a>
                <ElementListItem atom={atom}/>
              </a>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

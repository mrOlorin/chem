import React from 'react'
import { Electron, ElectronShell } from '../chem/paricles/Atom'
import OrbitalListItem from './OrbitalListItem'

type Props = {
  subLevels: ElectronShell,
}
export default class OrbitalList extends React.Component<Props> {
  render () {
    const itemStyle = {
      display: 'inline-block',
      width: '100px',
      height: '100px'
    };
    const { subLevels } = this.props;

    const electronsMapper = (electrons: Array<Electron>) =>
      <div key={`${electrons[0].l}-${electrons[0].m}`} style={itemStyle}><OrbitalListItem electrons={electrons}/></div>;

    const orbitalsMapper = (orbitals: Array<Array<Electron>>, i: number) =>
      <div style={{ textAlign: 'center' }} key={i}>{orbitals.map(electronsMapper)}</div>;

    return subLevels.map(orbitalsMapper);
  }
}

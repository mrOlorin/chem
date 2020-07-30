import React from 'react';
import { ElectronShell } from '../chem/paricles/Atom';
import OrbitalListItem from './OrbitalListItem';
import Electron from '../chem/paricles/Electron';

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

    return <div>
      <fieldset style={{position: 'absolute', display: 'inline-block'}}>
        <legend>Квантовые числа</legend>
        <p><span style={{color: 'red'}}>n</span> — главное; энергетический уровень</p>
        <p><span style={{color: 'green'}}>l</span> — орбитальное; форма</p>
        <p><span style={{color: 'blue'}}>m</span> — магнитное; ориентация в пространстве</p>
      </fieldset>
      {subLevels.map((orbitals: Array<Array<Electron>>, i: number) =>
        <div style={{ textAlign: 'center' }} key={i}>
          {orbitals.map((electrons: Array<Electron>) =>
            <div key={`${electrons[0].l}-${electrons[0].m}`} style={itemStyle}>
              <OrbitalListItem electrons={electrons}/>
              <code>
                <span style={{color: 'red'}}>{electrons[0].n}</span>&nbsp;
                <span style={{color: 'green'}}>{electrons[0].l}</span>&nbsp;
                <span style={{color: 'blue'}}>{electrons[0].m}</span>
              </code>
            </div>)}
        </div>
      )}
    </div>
  }
}

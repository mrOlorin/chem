import * as THREE from 'three';
import React, { RefObject } from 'react';
import { MultiThreeScene } from '../utils/MultiThree';
import Atom from '../chem/paricles/Atom';
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh';
import { MultiThreeContext } from './MultiThreeContext';
import ELECTRON_CONFIGURATIONS from '../chem/literals/electronConfigurations'
import Electron from '../chem/paricles/Electron'
import Utils from '../utils/Utils'
import { e } from '../chem/literals/constants'

type Props = {
  atom: Atom,
}
type State = {
  atom: Atom,
  scene?: MultiThreeScene,
}
export default class ElementDetails extends React.Component<Props, State> {
  static contextType = MultiThreeContext;
  private readonly sceneRef: RefObject<HTMLElement>;

  public constructor (public props: Props, public context: any) {
    super(props);
    this.state = { atom: props.atom };
    this.sceneRef = React.createRef();
  }

  public componentDidMount () {
    this.context.multiThree.addScene(ElementDetails.buildScene(this.state.atom, this.sceneRef.current as HTMLElement));
  }

  private static buildScene (atom: Atom, element: HTMLElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({
      electrons: atom.outerVacantElectrons,
      timeScale: 0.05,
      size: 800
    });
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  public render () {
    const { atom } = this.state;
    return <section>
      <h1>{atom.nucleus.name}</h1>
      <dl>
        <dt>Номер</dt>
        <dd><code>{atom.nucleus.Z}</code></dd>
      </dl>
      <h3>Ядро</h3>
      <dl>
        <dt>Число протонов</dt>
        <dd>
          <code>
            <var>Z</var> = {atom.nucleus.Z}
          </code>&nbsp;
          <meter value={atom.nucleus.Z} min="0" max={atom.nucleus.A}/>
        </dd>
        <dt>Число нейтронов</dt>
        <dd>
          <code>
            <var>N</var> = {atom.nucleus.N}
          </code>&nbsp;
          <meter value={atom.nucleus.N} min="0" max={atom.nucleus.A}/>
        </dd>
        <dt>Массовое число</dt>
        <dd>
          <code><var>A</var> = <var>Z</var> + <var>N</var> = {atom.nucleus.A}</code>
        </dd>
        <dt>Заряд</dt>
        <dd><code><var>{Utils.roundSuperPower(atom.nucleus.Z * -e)}</var>{atom.nucleus.Z > 0 && 'Кл'}</code></dd>
        <dt>Радиус</dt>
        <dd>
          <code>
            <var>R</var> ≈ <span
            title="0.00000000000000123"><var>r</var><sub>0</sub></span> * {atom.nucleus.A}<sup>⅓</sup> = {Utils.roundSuperPower(atom.nucleus.R)}м</code>
        </dd>
      </dl>
      <h3>Оболочка</h3>
      <dt>Число электронов</dt>
      <dd><code>{atom.electrons.length}</code></dd>
      <dt>Заряд</dt>
      <dd><code><var>{Utils.roundSuperPower(atom.electrons.length * e)}</var>{atom.electrons.length > 0 && 'Кл'}</code></dd>
      <dt>Электронная конфигурация</dt>
      <dd>
        <code>
          {atom.electronConfiguration}
          {(ELECTRON_CONFIGURATIONS[atom.Z][1] !== atom.electronConfiguration) &&
          <span title={'Правильно — ' + ELECTRON_CONFIGURATIONS[atom.Z][1]}> (не правильно)</span>}
        </code>
      </dd>
      <dt>Электроны</dt>
      <dd>
        <table style={{ textAlign: 'center' }}>
          <thead>
          <tr>
            <td>n</td>
            <td>l</td>
            <td>m</td>
            <td>ms</td>
            <td>Боровский радиус</td>
            <td>Скорость</td>
            <td>Энергия</td>
          </tr>
          </thead>
          <tbody>
          {atom.electrons.map((electron: Electron, i: number) =>
            <tr key={i}>
              <td><code>{electron.n}</code></td>
              <td><code>{electron.l}</code></td>
              <td><code>{electron.m}</code></td>
              <td><code>{electron.ms}</code></td>
              <td><code title={'' + electron.rBohr}>{Utils.roundSuperPower(electron.rBohr)}м</code></td>
              <td><code title={'' + electron.v}>{Utils.roundSuperPower(electron.v)}м/с</code></td>
              <td><code title={'' + electron.energy}>{Utils.roundSuperPower(electron.energy)}</code></td>
            </tr>
          )}
          </tbody>
        </table>
      </dd>
      <aside id="scene"
             ref={this.sceneRef}
             style={{
               width: '600px',
               height: '600px',
               position: 'fixed',
               right: '0',
               top: '0',
               zIndex: -1
             }}/>
    </section>
  }
}

import * as THREE from 'three';
import React, { RefObject } from 'react';
import { MultiThreeScene } from '../../utils/MultiThree';
import Atom from '../../chem/paricles/Atom';
import ElectronCloudMesh from '../../chem/mesh/ElectronCloudMesh';
import { MultiThreeContext } from '../multi-three/MultiThreeContext';
import ELECTRON_CONFIGURATIONS from '../../chem/literals/electronConfigurations';
import Electron from '../../chem/paricles/Electron';
import Utils from '../../utils/Utils';
import { e } from '../../chem/literals/constants';
// @ts-ignore
import { InlineMath } from 'react-katex';
import Nucleus from '../../chem/paricles/Nucleus';

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
      timeScale: 0.005,
      size: 800
    });
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  public render () {
    const { atom } = this.state;
    const { av, as, ac, at, ap } = atom.nucleus.energyCoefficients;
    return <section>
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
      <h1>{atom.nucleus.name}</h1>
      <dl>
        <dt>Номер в таблице</dt>
        <dd>
          <InlineMath math={'' + atom.nucleus.Z}/>
          <details>
            <InlineMath math={'Z = ' + atom.nucleus.Z}/>
          </details>
        </dd>
      </dl>

      <h3>Ядро</h3>
      <dl>
        <dt>Число протонов</dt>
        <dd>
          <InlineMath math={`Z = ${atom.nucleus.Z}`}/>&nbsp;
          <meter value={atom.nucleus.Z} min="0" max={atom.nucleus.A}/>
        </dd>

        <dt>Число нейтронов</dt>
        <dd>
          <InlineMath math={`N = ${atom.nucleus.N}`}/>&nbsp;
          <meter value={atom.nucleus.N} min="0" max={atom.nucleus.A}/>
        </dd>

        <dt>Массовое число</dt>
        <dd>
          <InlineMath math={`A = ${atom.nucleus.A}`}/>
          <details>
            <div>
              <InlineMath math={`A = Z + N`}/>
            </div>
            <div>
              <InlineMath math={`Z = ${atom.nucleus.Z}, N = ${atom.nucleus.N}`}/>
            </div>
            <div>
              <InlineMath math={`A = ${atom.nucleus.Z} + ${atom.nucleus.N} = ${atom.nucleus.A}`}/>
            </div>
          </details>
        </dd>

        <dt>Заряд</dt>
        <dd>
          <InlineMath
            math={`Q = ` + String.raw`${Utils.roundSuperPowerTex(atom.nucleus.electricCharge * e)} kl`}/>
          <details>
            <div>
              <InlineMath
                math={`Q = Z * e`}/>
            </div>
            <div>
              <InlineMath
                math={`Z = ${atom.nucleus.Z}, e = ${Utils.roundSuperPowerTex(e)} kl`}/>
            </div>
            <div>
              <InlineMath
                math={`Q = ${String.raw`${atom.nucleus.Z} * ${Utils.roundSuperPowerTex(e)} = ${Utils.roundSuperPowerTex(atom.nucleus.Z * e)} kl`}`}/>
            </div>
          </details>
        </dd>

        <dt>Энергия связи</dt>
        <dd>
          <InlineMath math={`Ew ≈ ${atom.nucleus.bindingEnergy.toPrecision(5)}MeV`}/>
          <details>
            <a href="https://ru.wikipedia.org/wiki/Капельная_модель_ядра#Вывод_формулы_Вайцзеккера"
               target="_blank">Формула Вайцзекера</a>:&nbsp;
            <div>
              <InlineMath math={`Ew ≈ 
                av * A - 
                as * A ^ \\frac{2}{3} - 
                ac * \\frac{Z ^ 2}{A ^ \\frac{1}{3}} - 
                at * \\frac{(A - 2 * Z) ^ 2}{A} - 
                ap * \\frac{\\delta}{A ^ \\frac{3}{4}}
                `}/>
            </div>
            <div>
              <InlineMath math={`
                av = ${av},
                as = ${as},
                ac = ${ac},
                at = ${at},
                ap = ${ap},
                A = ${atom.nucleus.A},
                Z = ${atom.nucleus.Z},
                \\delta = ${atom.nucleus.parity}`}/>
            </div>
            <div>
              <InlineMath math={`Ew ≈ 
                ${av} * ${atom.nucleus.A} - 
                ${as} * ${atom.nucleus.A} ^ \\frac{2}{3} - 
                ${ac} * \\frac{${atom.nucleus.Z}^2}{${atom.nucleus.A} ^ \\frac{1}{3}} -
                ${at} * \\frac{(${atom.nucleus.A} - 2 * ${atom.nucleus.Z}) ^ 2}{${atom.nucleus.A}} -
                ${ap} * \\frac{${atom.nucleus.parity}}{${atom.nucleus.A} ^ \\frac{3}{4}} ≈ 
                ${atom.nucleus.bindingEnergy.toPrecision(5)} MeV`}/>
            </div>
          </details>
        </dd>

        <dt>Радиус</dt>
        <dd>
          <InlineMath math={`R ≈ ${Utils.roundSuperPowerTex(atom.nucleus.R)} m`}/>
          <details>
            <div>
              <InlineMath math={`R ≈ r_{0} * A ^ \\frac{1}{3}`}/>
            </div>
            <div>
              <InlineMath math={`r_{0} = ${Utils.roundSuperPowerTex(Nucleus.r0)}m, A = ${atom.nucleus.A}`}/>
            </div>
            <div>
              <InlineMath
                math={`R ≈ ${Utils.roundSuperPowerTex(Nucleus.r0)} * ${atom.nucleus.A} ^ \\frac{1}{3} ≈ ${Utils.roundSuperPowerTex(atom.nucleus.R)}m`}/>
            </div>
          </details>
        </dd>
      </dl>

      <h3>Оболочка</h3>
      <dt>Число электронов</dt>
      <dd>
        <InlineMath math={'' + atom.electrons.length}/>
        <details>
          <InlineMath math={'Z = ' + atom.nucleus.Z}/>
        </details>
      </dd>

      <dt>Электронная конфигурация</dt>
      <dd>
        <InlineMath math={atom.electronConfigurationShortTex}/>
        {(!ELECTRON_CONFIGURATIONS[atom.Z] || (ELECTRON_CONFIGURATIONS[atom.Z][1] !== atom.electronConfiguration)) &&
        <span
            title={'Правильно — ' + (ELECTRON_CONFIGURATIONS[atom.Z] ? ELECTRON_CONFIGURATIONS[atom.Z][1] : 'хз как')}>
            (не правильно)
        </span>}
        <details>
          <InlineMath math={atom.electronConfigurationTex}/>
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
                <td>{electron.n}</td>
                <td>{electron.l}</td>
                <td>{electron.m}</td>
                <td>{electron.ms}</td>
                <td title={'' + electron.rBohr}>{Utils.roundSuperPower(electron.rBohr)}м</td>
                <td title={'' + electron.v}>{Utils.roundSuperPower(electron.v)}м/с</td>
                <td title={'' + electron.energy}>{Utils.roundSuperPower(electron.energy)}</td>
              </tr>
            )}
            </tbody>
          </table>
        </details>
      </dd>
    </section>
  }
}

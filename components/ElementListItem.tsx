import * as THREE from 'three';
import React, { CSSProperties, RefObject } from 'react';
import { MultiThreeScene } from '../utils/MultiThree';
import Atom from '../chem/paricles/Atom';
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh';
import { MultiThreeContext } from './MultiThreeContext';
import Link from 'next/link';
import ELECTRON_CONFIGURATIONS from '../chem/literals/electronConfigurations';

type Props = {
  atom: Atom,
}
type State = {
  atom: Atom,
  scene?: MultiThreeScene,
}
export default class ElementListItem extends React.Component<Props, State> {
  static contextType = MultiThreeContext;
  private readonly sceneRef: RefObject<SVGSVGElement>;

  public constructor (public props: Props, public context: any) {
    super(props);
    this.state = { atom: props.atom };
    this.sceneRef = React.createRef();
  }

  public componentDidMount () {
    this.context.multiThree.addScene(ElementListItem.buildScene(this.state.atom, this.sceneRef.current as SVGSVGElement));
  }

  private static buildScene (atom: Atom, element: SVGSVGElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({
      electrons: atom.outerVacantElectrons,
      timeShift: atom.maxN * atom.Z,
      size: 70
    });
    mesh.position.y += 0.1;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  public render () {
    const style: CSSProperties = {
    };
    const { atom } = this.state;
    return <Link href="/elements/[Z]" as={`/elements/${atom.nucleus.Z}`}>
      <a>
        <svg id={`element-${atom.Z}`}
             width="50" height="85"
             style={style}
             ref={this.sceneRef}>
          <text y="9" fontSize="0.6em">
            <title>Массовое число</title>
            {atom.nucleus.A}
          </text>
          <text y="20" fontSize="0.6em">
            <title>Атомное число</title>
            {atom.nucleus.Z}
          </text>
          <text x={7 + 3 * atom.nucleus.A.toString().length} y="15" fontWeight="bold" fontSize="1em">
            {atom.nucleus.name}
          </text>
          <text y="70" x="10" fontStretch="ultra-expanded" fontSize="0.8em">
            {(!ELECTRON_CONFIGURATIONS[atom.Z] || (ELECTRON_CONFIGURATIONS[atom.Z][1] !== atom.electronConfiguration)) &&
            '!'}
            {atom.electronConfigurationShort}
          </text>
        </svg>
      </a>
    </Link>
  }
}

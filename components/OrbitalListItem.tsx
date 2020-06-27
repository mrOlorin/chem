import * as THREE from 'three';
import React, { RefObject } from 'react'
import { MultiThreeScene } from '../utils/MultiThree'
import { Electron } from '../chem/paricles/Atom'
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh'
import { MultiThreeContext } from './MultiThreeContext'

type Props = {
  electrons: Array<Electron>;
}
type State = {
  scene?: MultiThreeScene;
  electrons: Array<Electron>;
}
export default class OrbitalListItem extends React.Component<Props, State> {
  static contextType = MultiThreeContext;
  private readonly sceneRef: RefObject<SVGSVGElement>;
  private scene?: MultiThreeScene;

  public constructor (props: Props) {
    super(props);
    this.sceneRef = React.createRef();
    this.state = {
      electrons: props.electrons
    };
  }

  componentDidMount () {
    this.scene = OrbitalListItem.buildScene(
      this.state.electrons, this.sceneRef.current as SVGSVGElement
    );
    this.context.multiThree.addScene(this.scene);
  }

  componentWillUnmount () {
    this.scene && this.context.multiThree.removeScene(this.scene);
  }

  private static buildScene (electrons: Array<Electron>, element: SVGSVGElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({ electrons, timeScale: 1 });
    mesh.options.timeScale *= 0.1;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  render () {
    const { electrons } = this.state;
    const id = `orbital-${electrons[0].n}-${electrons[0].l}-${electrons[0].m}`;
    const style = {
      width: '100%',
      height: '100%'
    };
    return (
      (electrons && <svg id={id}
                         style={style}
                         ref={this.sceneRef}>
          <text y="100%" x="50%" textAnchor="middle" fontSize="0.6em">
              n: {electrons[0].n} l: {electrons[0].l} m: {electrons[0].m}
          </text>
      </svg>)
    );
  }
}

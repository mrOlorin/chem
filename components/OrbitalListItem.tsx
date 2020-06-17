import * as THREE from 'three';
import React, { RefObject } from 'react'
import MultiThree, { MultiThreeScene } from '../utils/MultiThree'
import { Electron } from '../chem/paricles/Atom'
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh'

type Props = {
  electrons: Array<Electron>,
}
type State = {
  scene?: MultiThreeScene,
  electrons: Array<Electron>,
}
export default class OrbitalListItem extends React.Component {
  public props!: Props;
  public state!: State;
  private sceneRef: RefObject<SVGSVGElement>;

  public constructor (props: Props) {
    super(props);
    this.sceneRef = React.createRef();
    this.state = {
      electrons: props.electrons
    };
  }

  componentDidMount () {
    this.state.scene = OrbitalListItem.buildScene(
      this.props.electrons, this.sceneRef.current as SVGSVGElement
    );
    MultiThree.addScene(this.state.scene);
  }

  componentWillUnmount () {
    if (this.state.scene) MultiThree.removeScene(this.state.scene);
  }

  private static buildScene (electrons: Array<Electron>, element: SVGSVGElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({ electrons, timeScale: 1 });
    mesh.position.z -= 10;
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
      height: '100%',
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

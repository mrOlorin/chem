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

  public constructor (props: Props) {
    super(props);
    this.sceneRef = React.createRef();
    this.state = {
      electrons: props.electrons
    };
  }

  public componentDidMount () {
    this.context.multiThree.addScene(OrbitalListItem.buildScene(
      this.state.electrons, this.sceneRef.current as SVGSVGElement
    ));
  }

  private static buildScene (electrons: Array<Electron>, element: SVGSVGElement): MultiThreeScene {
    const scene = new THREE.Scene();
    scene.add(new ElectronCloudMesh({ electrons }));
    return { element, scene };
  }

  public render () {
    const { electrons } = this.state;
    const style = {
      width: '100%',
      height: '100%'
    };
    return <svg id={`orbital-${electrons[0].n}-${electrons[0].l}-${electrons[0].m}`}
                style={style}
                ref={this.sceneRef}>
      <text y="100%" x="50%" textAnchor="middle" fontSize="0.6em">
        n: {electrons[0].n} l: {electrons[0].l} m: {electrons[0].m}
      </text>
    </svg>
  }
}

import * as THREE from 'three';

import React, { RefObject } from 'react'
import Nucleus from '../chem/paricles/Nucleus'
import ParticleBuilder from '../chem/ParticleBuilder'
import MultiThree, { MultiThreeScene } from '../utils/MultiThree'
import NucleusMesh from '../chem/mesh/NucleusMesh'

type Props = {
  Z: number,
  N: number,
}
type State = {
  nucleus: Nucleus,
  scene?: MultiThreeScene,
}
export default class NuclideListItem extends React.Component {
  public props!: Props;
  public state: State;
  private sceneRef: RefObject<SVGSVGElement>;
  private scene!: MultiThreeScene;

  public constructor (props: Props) {
    super(props);
    this.sceneRef = React.createRef();
    this.state = {
      nucleus: ParticleBuilder.buildNucleus(props.Z, props.N)
    };
  }

  componentDidMount () {
    this.scene = NuclideListItem.buildScene(this.state.nucleus, this.sceneRef.current as SVGSVGElement);
    MultiThree.addScene(this.scene);
  }

  componentWillUnmount () {
    MultiThree.removeScene(this.scene);
  }

  private static buildScene (nucleus: Nucleus, element: SVGSVGElement): MultiThreeScene {
    const mesh = new NucleusMesh({ nucleus, timeScale: 1 });
    mesh.position.z -= 12;
    mesh.position.y -= 2;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  render () {
    const style = {
      height: '80px',
      width: '80px',
      border: '1px dashed #2c3e50'
    };
    const { nucleus } = this.state;
    return (
      (nucleus && <svg id={`nuclide-${nucleus.Z}-${nucleus.N}`}
                       className='nuclide-list-item'
                       style={style}
                       ref={this.sceneRef}>
          <text x="2" y="10" fontSize="0.6em">
              <title>Массовое число</title>
            {nucleus.A}
          </text>
          <text x="2" y="21" fontSize="0.6em">
              <title>Атомное число</title>
            {nucleus.Z}
          </text>
          <text x="2" y="32" fontSize="0.6em">
              <title>Число нейтронов</title>
            {nucleus.N}
          </text>
          <text x={10 + 3 * nucleus.A.toString().length} y="19" fontSize="1.2em">
            {nucleus.name}
          </text>
          <text textAnchor="end" x="79" y="10" fontSize="0.6em">
              <title>Радиус {nucleus.R}м</title>
            {(nucleus.R).toPrecision(4)}
          </text>
      </svg>)
    );
  }
}

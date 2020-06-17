import * as THREE from 'three';
import React, { RefObject } from 'react'
import ParticleBuilder from '../chem/ParticleBuilder'
import MultiThree, { MultiThreeScene } from '../utils/MultiThree'
import Atom from '../chem/paricles/Atom'
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh'

type Props = {
  Z: number,
}
type State = {
  atom: Atom,
  scene?: MultiThreeScene,
}
export default class ElementListItem extends React.Component {
  public props!: Props;
  public state: State;
  private sceneRef: RefObject<SVGSVGElement>;
  private scene!: MultiThreeScene;

  public constructor (props: Props) {
    super(props);
    this.sceneRef = React.createRef();
    this.state = {
      atom: ParticleBuilder.buildAtom(props.Z)
    };
  }

  componentDidMount () {
    this.scene = ElementListItem.buildScene(this.state.atom, this.sceneRef.current as SVGSVGElement);
    MultiThree.addScene(this.scene);
  }

  componentWillUnmount () {
    MultiThree.removeScene(this.scene);
  }

  private static buildScene (atom: Atom, element: SVGSVGElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({ electrons: atom.outerVacantElectrons, timeScale: 1 });
    mesh.position.y -= 4;
    mesh.position.z -= 15;
    mesh.options.timeScale *= 0.1;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element, scene };
  }

  render () {
    const style = {
      padding: '2px',
      marginRight: '4px',
      border: '1px dashed #2c3e50'
    };
    const { atom } = this.state;
    return (
      (atom && <svg id={`element-${atom.Z}`}
                    width="80" height="80"
                    className='nuclide-list-item'
                    style={style}
                    ref={this.sceneRef}>
          <text x="2" y="12" fontSize="0.6em">
              <title>Массовое число</title>
            {atom.nucleus.A}
          </text>
          <text x="2" y="23" fontSize="0.6em">
              <title>Атомное число</title>
            {atom.nucleus.Z}
          </text>
          <text x={10 + 3 * atom.nucleus.A.toString().length} y="20" fontSize="1.2em">
            {atom.nucleus.name}
          </text>
          <text textAnchor="end" x="78" y="12" fontSize="0.7em">
              <title>{atom.electronConfiguration}</title>
            {atom.electronConfigurationShort}
          </text>
      </svg>)
    );
  }
}
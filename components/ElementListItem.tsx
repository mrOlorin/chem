import * as THREE from 'three';
import React, { RefObject } from 'react'
import { MultiThreeScene } from '../utils/MultiThree'
import Atom from '../chem/paricles/Atom'
import ElectronCloudMesh from '../chem/mesh/ElectronCloudMesh'
import { MultiThreeContext } from './MultiThreeContext'

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
  private scene?: MultiThreeScene;

  public constructor (public props: Props, public context: any) {
    super(props);
    this.state = { atom: props.atom };
    this.sceneRef = React.createRef();
  }

  componentDidMount () {
    this.scene = ElementListItem.buildScene(this.state.atom, this.sceneRef.current as SVGSVGElement);
    this.context.multiThree.addScene(this.scene);
  }

  componentWillUnmount () {
    this.scene && this.context.multiThree.removeScene(this.scene);
  }

  private static buildScene (atom: Atom, element: SVGSVGElement): MultiThreeScene {
    const mesh = new ElectronCloudMesh({ electrons: atom.outerVacantElectrons, timeScale: 0.1 });
    mesh.position.y -= 0.3;
    mesh.position.z -= 0.4;
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

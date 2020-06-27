import React, { Component } from 'react'
import MultiThree from '../utils/MultiThree'
import { MultiThreeContextType, MultiThreeContext } from './MultiThreeContext'

type State = Partial<MultiThreeContextType>;

export default class MultiThreeProvider extends Component<{}, State> {
  private readonly sceneRef!: React.RefObject<HTMLCanvasElement>;

  public constructor (props: {}) {
    super(props);
    this.state = { multiThree: undefined };
    this.sceneRef = React.createRef();
  }

  public componentDidMount () {
    this.setState({
      multiThree: new MultiThree(this.sceneRef.current as HTMLCanvasElement)
    });
  }

  public componentWillUnmount () {
    this.state.multiThree && this.state.multiThree.dispose();
  }

  render () {
    const { ...children } = this.props;
    const { multiThree } = this.state;
    return (
      <div>
        <canvas ref={this.sceneRef}/>
        {multiThree && <MultiThreeContext.Provider value={{ multiThree }} {...children} />}
      </div>
    )
  }
}
import React, { ReactNode, RefObject } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import MultiThree from '../utils/MultiThree'

type Props = {
  children?: ReactNode
  title?: string
}
export default class Layout extends React.Component {
  private readonly sceneRef: RefObject<HTMLCanvasElement>;

  public constructor (public props: Props) {
    super(props);
    this.sceneRef = React.createRef();
  }

  componentDidMount () {
    MultiThree.init(this.sceneRef.current as HTMLCanvasElement);
  }

  render () {
    const { children, title = 'This is the default title' } = this.props;
    return (
      <div>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <header>
          <nav>
            <Link href="/">
              <a>⁂</a>
            </Link>{' '}
            |{' '}
            <Link href="/orbitals">
              <a>Орбитали</a>
            </Link>{' '}
            |{' '}
            <Link href="/elements">
              <a>Элементы</a>
            </Link>{' '}
            |{' '}
            <Link href="/nuclides">
              <a>Нуклиды</a>
            </Link>{' '}
            |{' '}
            <Link href="/about">
              <a>О</a>
            </Link>
          </nav>
        </header>
        <canvas ref={this.sceneRef}/>
        {children}
        <footer>
          <hr/>
        </footer>
      </div>
    );
  }
}

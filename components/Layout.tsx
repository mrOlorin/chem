import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import MultiThreeProvider from './multi-three/MultiThreeProvider';

type Props = {
  children?: ReactNode
  title?: string
}
export default class Layout extends React.Component<Props> {
  render () {
    const { title, children } = this.props;
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
              <a>Сферические гармоники</a>
            </Link>{' '}
            |{' '}
            <Link href="/elements">
              <a>Элементы</a>
            </Link>{' '}
            |{' '}
            <Link href="/nuclides">
              <a>Нуклиды</a>
            </Link>
          </nav>
        </header>
        <MultiThreeProvider children={children}/>
        <footer>
        </footer>
      </div>
    );
  }
}

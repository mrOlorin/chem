import React from 'react';
import { AppProps } from 'next/app';
import 'katex/dist/katex.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
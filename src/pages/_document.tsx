import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta content="福岡に住む Ko Portfolio Website です" name="description" />

          {/* Favicons */}
          <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/favicons/site.webmanifest" rel="manifest" />
          <link color="#5bbad5" href="/favicons/safari-pinned-tab.svg" rel="mask-icon" />
          <meta content="#da532c" name="msapplication-TileColor" />
          <meta content="#ffffff" name="theme-color" />

          {/* OGP */}
          <meta content="https://www.portfolio.fukuoka.jp/" property="og:url" />
          <meta content="website" property="og:type" />
          <meta content="https://www.portfolio.fukuoka.jp/ogp.png" property="og:image" />
          <meta content="Ko Portfolio" property="og:title" />
          <meta content="福岡に住む Ko Portfolio Website です" property="og:description" />
          <meta content="summary_large_image" name="twitter:card" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

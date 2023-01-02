import Head from 'next/head';

type Props = {
  description: string;
  title?: string;
};

export const PageHead = (props: Props) => {
  const title =
    props.title != null
      ? `${props.title} | Ko Web Creator Portfolio Site`
      : 'Ko Web Creator Portfolio Site';
  const regex = /(<([^>]+)>)/g;
  let description = props.description.replace(regex, '');
  description = description.length > 110 ? description.substring(0, 110) : description;

  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />

      <meta content="website" property="og:type" />
      <meta content={title} property="og:title" />
      <meta content="https://portfolio.fukuoka.jp/ogp.png" property="og:image" />
      <meta content="https://portfolio.fukuoka.jp/" property="og:siteUrl" />
      <meta content={title} property="og:site_name" />
      <meta content={description} property="og:description" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="website" property="og:type" />
    </Head>
  );
};

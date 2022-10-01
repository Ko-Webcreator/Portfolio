import Head from 'next/head';

type Props = {
  description: string;
  dir?: string;
  image?: string;
  title?: string;
};

export const PageHead = (props: Props) => {
  const title = props.title != null ? `${props.title} | Ko Portfolio` : 'Ko Portfolio';
  const image = props.image != null ? props.image : 'Ko Portfolio';
  const dir = props.dir != null ? props.dir : '';
  const url = '';
  const regex = /(<([^>]+)>)/g;
  let description = props.description.replace(regex, '');
  description = description.length > 110 ? description.substring(0, 110) : description;

  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />

      <meta content="website" property="og:type" />
      <meta content={title} property="og:title" />
      <meta content={image} property="og:image" />
      <meta content={`${url}${dir}`} property="og:siteUrl" />
      <meta content={title} property="og:site_name" />
      <meta content={description} property="og:description" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="website" property="og:type" />
    </Head>
  );
};

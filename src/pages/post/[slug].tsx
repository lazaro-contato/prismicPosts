import { GetStaticPaths, GetStaticProps } from 'next';
import * as prismicH from '@prismicio/helpers';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { createClient, linkResolver } from '../../../prismicio';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ page }) {
  console.log(page);
  return <div>vamos vamos</div>;
}

export const getStaticProps: GetStaticProps = async ({
  previewData,
  params,
}) => {
  const client = createClient({ previewData });
  const uid = params.slug as string;
  const page = await client.getByUID('post', uid);

  return {
    props: {
      page,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = createClient();
  //
  // const pages = await client.getByUID('post');
  // console.log(pages);

  return {
    paths: [],
    fallback: true,
  };
};

// return {
//   paths: pages.map(page => prismicH.asLink(page)),
//   fallback: true,
// };

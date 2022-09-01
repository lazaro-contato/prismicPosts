import { GetStaticPaths, GetStaticProps } from 'next';
import * as prismicH from '@prismicio/helpers';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';
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

export default function Post({ post }: PostProps) {
  const postContent = post.data.content;

  const renderPostContent = () => {
    const contents = () =>
      postContent.map(item => {
        return (
          <>
            <h2>{item.heading}</h2>
            <div>{item.body}</div>
          </>
        );
      });

    contents();
  };
  console.log(post);
  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main className={styles.container}>
        <img src={post.data.banner.url} alt={post.data.banner.url} />
        <h1>{post.data.title}</h1>
        <div>
          <div>
            <span>{post.first_publication_date}</span>
          </div>
          <div>
            <span>{post.data.author}</span>
          </div>
          <div>
            <span>4 Min</span>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  previewData,
  params,
}) => {
  const client = createClient({ previewData });
  const uid = params.slug as string;
  const post = await client.getByUID('post', uid);

  return {
    props: {
      post: {
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          banner: {
            url: post.data.banner.url,
          },
          author: post.data.author,
          content: post.data.content,
        },
      },
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

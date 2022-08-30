import { GetStaticProps } from 'next';

import { createClient } from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SliceZone } from '@prismicio/react';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/all';
import { formatDate } from '@prismicio/types-internal/lib/validators/function';
import item from 'slice-machine-ui/components/AppLayout/Navigation/Menu/Navigation/Item';
import Link from 'next/link';
import sm from '../../sm.json';
import { components } from '../../slices';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const renderPosts = () => {
    return (
      <>
        {postsPagination.results.map(post => {
          return (
            <Link href={`/post/${post.uid}`} prefetch>
              <div
                className={styles.postItem}
                key={Math.random() * Math.random()}
              >
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
                <div className={styles.dataContainer}>
                  <div>
                    <FiCalendar />
                    <span>{post.first_publication_date}</span>
                  </div>
                  <div>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.content}>{renderPosts()}</section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient(sm.apiEndpoint);
  const page = await client.getByType('post', {
    pageSize: 4,
    fetchLinks: ['post.title', 'post.subtitle'],
  });

  const posts = page.results.map(post => {
    const date = format(new Date(post.last_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    });
    return {
      uid: post.uid,
      first_publication_date: date,
      data: {
        title: post.data.title as string,
        subtitle: post.data.subtitle as string,
        author: post.data.author as string,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        nextPage: page.next_page,
        results: posts,
      },
    },
  };
};

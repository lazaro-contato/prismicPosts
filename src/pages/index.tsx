import { GetStaticProps } from 'next';

import { createClient } from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { SliceZone } from '@prismicio/react';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/all';
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

export default function Home({ page }) {
  console.log(page);

  const renderPosts = () => {
    const posts = page.results;
    return (
      <>
        {posts.map(post => {
          return (
            <div className={styles.postItem}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div className={styles.dataContainer}>
                <div>
                  <FiCalendar />
                  <span>15 Mar 2021</span>
                </div>
                <div>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </div>
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
  const page = await client.getByType('post');

  return {
    props: {
      page,
    },
  };
};

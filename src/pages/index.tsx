import { GetStaticProps } from 'next';

import { createClient } from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
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

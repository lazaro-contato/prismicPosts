import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '../../prismicio';
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
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient(previewData);
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

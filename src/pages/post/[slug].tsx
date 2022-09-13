import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
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
  const postData = post.data;
  const postContent = postData.content.map(item => item);

  const renderPostContent = () => {
    return (
      <>
        {postContent.map(item => {
          return (
            <>
              <h2>{item.heading}</h2>
              {item.body.map(textData => {
                return (
                  <p dangerouslySetInnerHTML={{ __html: textData.text }} />
                );
              })}
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url(${postData.banner.url})` }}
      />
      <main className={styles.container}>
        <h1>{postData.title}</h1>
        <div>
          <div>
            <span>{post.first_publication_date}</span>
          </div>
          <div>
            <span>{postData.author}</span>
          </div>
          <div>
            <span>4 Min</span>
          </div>
        </div>
        <div className={styles.postContent}>{renderPostContent()}</div>
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
    revalidate: 60 * 30,
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

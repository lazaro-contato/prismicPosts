import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';
import * as prismicNext from '@prismicio/next';
import sm from '../../sm.json';

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

// export function linkResolver(doc) {
//   switch (doc.type) {
//     case 'homepage':
//       return '/';
//     case 'post':
//       return `post/${doc.uid}`;
//     default:
//       return null;
//   }
// }

const routes = [
  {
    type: 'post',
    path: 'post/:uid',
    resolvers: {
      category: 'category', // API ID of the content relationship in the Custom Type
      section: 'category.section',
    },
  },
  {
    type: 'home-page',
    path: '/:lang',
  },
]

export const createClient = (config = {}) => {
  const client = prismic.createClient(sm.apiEndpoint, config);

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};

import React from 'react';
import { PrismicRichText } from '@prismicio/react';

const PostsSlice = ({ slice }) => (
  <section>
    <PrismicRichText field={slice.primary.description} />
    <PrismicRichText field={slice.primary.title} />
  </section>
);

export default PostsSlice;

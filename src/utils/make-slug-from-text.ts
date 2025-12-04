import slugify from 'slugify';
import { makeRandomString } from './make-random-strings';

export const makeSlugFromText = (text: string) => {
  const slug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  return `${slug}-${makeRandomString()}`;
};
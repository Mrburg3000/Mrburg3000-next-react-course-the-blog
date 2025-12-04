import { postRepository } from '@/repositories/post/index';
import { cache } from 'react';

export const findPostByIdAdmin = cache(async (id: string) => {
  return postRepository.findById(id);
});

export const findAllPostAdmin = cache(async () => {
  return postRepository.findAll();
});
import { PostRepository } from '../post/post-repository';
import { DrizzlePostRepository } from '../post/drizzle-post-repository';


export const postRepository: PostRepository = new DrizzlePostRepository();
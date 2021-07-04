import { IContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) _id: number,
        @Ctx()
        { em }: IContext
    ): Promise<Post | null> {
        return em.findOne(Post, { _id });
    }

    @Query(() => [Post])
    posts(
        @Ctx()
        { em }: IContext
    ): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: IContext
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') _id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Ctx() { em }: IContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { _id });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') _id: number,
        @Ctx() { em }: IContext
    ): Promise<Boolean> {
        await em.nativeDelete(Post, { _id });
        return true;
    }
}

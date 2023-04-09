import { PostModel, CommentModel } from "../types"

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string
}

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined,
    content: string | undefined
}

export interface EditPostInputDTO {
    idToEdit: string
    token: string | undefined
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string
    token: string | undefined
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}

export interface getCommentsInputDTO {
    token: string|undefined,
    postId: string
}

export type getCommentsOutputDTO = CommentModel[]

export interface CreateCommentDTO {
    token: string | undefined,
    postId: string | undefined,
    content: string | undefined
}

export interface editCommentIpuntDTO {
    idToEdit: string,
    token: string | undefined,
    content: string | undefined
}

export interface deleteCommentInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikeCommentInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}
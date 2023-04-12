import { BaseDatabase } from "../../src/database/BaseDatabase"
import { COMMENT_LIKE, CommentDB, CommentWithCreatorDB, Comment_Like_DislikeDB, POST_LIKE } from "../../src/types"


export class CommentDatabaseMock extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKE_DISLIKE_COMMENTS = "likes_dislikes_comments"

    public insert = async (commentDB: CommentDB) => {
        //não possui retorno
    }

    public getCommentWithCreator = async (): Promise<CommentWithCreatorDB[]> => {
        const result = [
            {
                id: "id-mock-comment",
                creator_id: "id-mock",
                post_id: "id-mock-post",
                content: "comment mock test",
                likes: 0,
                dislikes: 0,
                created_at: "2023-04-10T21:07:37.119Z",
                updated_at: "2023-04-10T21:07:37.119Z",
                creator_name: "Normal Mock"
            }
        ]

        return result
    }

    public findById = async (id: string) => {
        return {
            id: "id-mock-post",
            creator_id: "id-mock",
            post_id:"id-mock-post",
            content: "Teste-mock",
            likes: 0,
            dislikes: 0,
            created_at: "2023-04-10T21:07:37.119Z",
                updated_at: "2023-04-10T21:07:37.119Z",
            creator_name: "Normal Mock"
        }
    }

    public update = async (id: string, commentDB: CommentDB): Promise<void> => {
        //não possui retorno
    }

    public delete = async (id: string): Promise<void> => {
        //não possui retorno
    }

    public findCommentsWithCreatorById = async (commentId: string): Promise<CommentWithCreatorDB | undefined> => {
        if (commentId = "id-mock-post") {
            return {
                id: "id-mock-post",
                creator_id: "id-mock",
                post_id: "id-mock-post",
                content: "content Mock",
                likes: 0,
                dislikes: 0,
                created_at: "2023-04-10T21:07:37.119Z",
                updated_at: "2023-04-10T21:07:37.119Z",
                creator_name: "Normal Mock"
            }
        } else {
            return undefined
        }
    }

    public getCommentByPostIdWithCreator = async (postId: string): Promise<CommentWithCreatorDB[]> => {
        const result = [
            {
                id: "id-mock-comment",
                creator_id: "id-mock",
                post_id: "id-mock-post",
                content: "comment mock test",
                likes: 0,
                dislikes: 0,
                created_at: "2023-04-10T21:07:37.119Z",
                updated_at: "2023-04-10T21:07:37.119Z",
                creator_name: "Normal Mock"
            }
        ]

        return result
    }

    public likeOrDislikeComment = async (likeDislike: Comment_Like_DislikeDB): Promise<void> => {
        //não tem retorno
    }

    public findLikeDislike = async (CommentLikeDislikeDBToFind: Comment_Like_DislikeDB): Promise<POST_LIKE | null> => {
        if (CommentLikeDislikeDBToFind) {
            return POST_LIKE.ALREADY_LIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (
        Comment_Like_DislikeDB: Comment_Like_DislikeDB
    ): Promise<void> => {
        //não tem retorno
    }

    public updateLikeDislike = async (
        likeOrDislikeComment: Comment_Like_DislikeDB
    ) => {
        //não tem retorno
    }

}
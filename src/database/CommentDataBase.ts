import { CommentDB, CommentWithCreatorDB, Comment_Like_DislikeDB, POST_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKE_DISLIKE_COMMENTS = "likes_dislikes_comments"

    public insert = async (commentDB: CommentDB) => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(commentDB)

    }

    public getCommentWithCreator = async (): Promise<CommentWithCreatorDB[]> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select(
                "comments.id",
                "comments.creator_id",
                "comments.post_id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "comments.creator_id", "=", "users.id")
    

        return result
    }

    public findById = async (id: string) => {
        const result: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({ id })

        return result[0]
    }

    public update = async (id: string, commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({ id })
    }

    public delete = async (id:string):Promise<void>=>{
        await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .delete()
        .where({id})
    }

    public findCommentsWithCreatorById = async(commentId:string):Promise<CommentWithCreatorDB|undefined> =>{
        const result: CommentWithCreatorDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            "comments.id",
            "comments.creator_id",
            "comments.post_id",
            "comments.content",
            "comments.likes",
            "comments.dislikes",
            "comments.created_at",
            "comments.updated_at",
            "users.name AS creator_name"
        )
        .join("users", "comments.creator_id", "=", "users.id")
        .where("comments.id", commentId)

    return result[0]
    }

    public getCommentByPostIdWithCreator = async (postId:string): Promise<CommentWithCreatorDB[]> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select(
                "comments.id",
                "comments.creator_id",
                "comments.post_id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .join("posts","comments.post_id","=","posts.id")
            .where("comments.post_id", postId)

        return result
    }

    public likeOrDislikeComment = async (likeDislike: Comment_Like_DislikeDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKE_DISLIKE_COMMENTS)
            .insert(likeDislike)
    }

    public findLikeDislike = async (CommentLikeDislikeDBToFind: Comment_Like_DislikeDB): Promise<POST_LIKE| null> => {

        const [Comment_Like_DislikeDB]: Comment_Like_DislikeDB[] | [] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKE_DISLIKE_COMMENTS)
            .select()
            .where({
                user_id: CommentLikeDislikeDBToFind.user_id,
                comment_id: CommentLikeDislikeDBToFind.comment_id
            })

        if (Comment_Like_DislikeDB) {
            return Comment_Like_DislikeDB.like === 1 ? POST_LIKE.ALREADY_LIKED: POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (
        Comment_Like_DislikeDB: Comment_Like_DislikeDB
        ): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKE_DISLIKE_COMMENTS)
            .delete()
            .where({
                user_id: Comment_Like_DislikeDB.user_id,
                comment_id: Comment_Like_DislikeDB.comment_id
            })
    }
    
    public updateLikeDislike =async (
        likeOrDislikeComment:Comment_Like_DislikeDB
        ) => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKE_DISLIKE_COMMENTS)
        .update(likeOrDislikeComment)
        .where({
            user_id: likeOrDislikeComment.user_id,
            comment_id: likeOrDislikeComment.comment_id
        })
    }

}
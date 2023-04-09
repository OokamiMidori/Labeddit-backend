import { CommentDataBase } from "../database/CommentDataBase";
import PostDatabase from "../database/PostDataBase";
import { CreateCommentDTO, LikeOrDislikeCommentInputDTO, deleteCommentInputDTO, editCommentIpuntDTO, getCommentsInputDTO, getCommentsOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentDB, CommentWithCreatorDB, Comment_Like_DislikeDB, POST_LIKE, USER_ROLES } from "../types";

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDataBase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase
    ) { }

    public getCommentsOfPost = async (input: getCommentsInputDTO): Promise<getCommentsOutputDTO> => {
        const { token, postId } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        if (typeof postId !== "string") {
            throw new BadRequestError("O id do post deve ser uma string")
        }

        const commentsWithCreatorDB: CommentWithCreatorDB[] = await this.commentDatabase.getCommentByPostIdWithCreator(postId)

        const comments = commentsWithCreatorDB.map((commentWithCreatorDB) => {
            const comment = new Comment(
                commentWithCreatorDB.id,
                commentWithCreatorDB.content,
                commentWithCreatorDB.likes,
                commentWithCreatorDB.dislikes,
                commentWithCreatorDB.created_at,
                commentWithCreatorDB.updated_at,
                commentWithCreatorDB.creator_id,
                commentWithCreatorDB.creator_name,
                commentWithCreatorDB.post_id
            )
            return comment.toBusinessModel()
        })
       
        return comments
    }

    public createComment = async (input: CreateCommentDTO): Promise<void> => {
        const { token, content, postId } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        if (!postId) {
            throw new BadRequestError("'postId' ausente")
        }

        if (typeof postId !== "string") {
            throw new BadRequestError("'postId' deve ser uma string")
        }

        const idPost = await this.postDatabase.findById(postId)

        if (!idPost) {
            throw new NotFoundError("'postId' não encontrado")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        const comment = new Comment(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName,
            idPost.id
        )

        const commentDB = comment.toDBModel()

        await this.commentDatabase.insert(commentDB)
    }

    public editComment = async (input: editCommentIpuntDTO): Promise<void> => {
        const { token, content, idToEdit } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.findById(idToEdit)

        if (!commentDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (commentDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou o comment pode editá-lo")
        }

        const creatorName = payload.name

        const comment = new Comment(
            commentDB.id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            creatorId,
            creatorName,
            commentDB.post_id
        )

        comment.setContent(content)

        comment.setUpdatedAt(new Date().toISOString())
        const updatedCommentDB = comment.toDBModel()

        await this.commentDatabase.update(idToEdit, updatedCommentDB)
    }

    public deleteComment = async (input: deleteCommentInputDTO): Promise<void> => {
        const { token, idToDelete } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.findById(idToDelete)

        if (!commentDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (payload.role !== USER_ROLES.ADMIN && commentDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou o comment pode deletá-lo")
        }

        await this.commentDatabase.delete(idToDelete)
    }

    public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<void> => {
        const { token, idToLikeOrDislike, like } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = await this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser um boolean")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentsWithCreatorById(idToLikeOrDislike)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: Comment_Like_DislikeDB = {
            user_id: userId,
            comment_id: commentWithCreatorDB.id,
            like: likeSQLite
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at,
            commentWithCreatorDB.updated_at,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.creator_name,
            commentWithCreatorDB.post_id
        )

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {

            if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }

        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeDB)

            if (like) {
                comment.addLike()
            } else {
                comment.addDislike()
            }
        }

        const updatedcommentDB = comment.toDBModel()

        await this.commentDatabase.update(idToLikeOrDislike, updatedcommentDB)
    }

}
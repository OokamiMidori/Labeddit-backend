import PostDatabase from "../database/PostDataBase"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostInputDTO } from "../dtos/userDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikeDislikeDB, PostDB, PostWithCreatorDB, POST_LIKE, USER_ROLES } from "../types"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        const postsWhitCreatorsDB: PostWithCreatorDB[] =
            await this.postDatabase
                .getPostsWithCreator()

        const posts = postsWhitCreatorsDB.map((postWhitCreatorDB) => {
            const post = new Post(
                postWhitCreatorDB.id,
                postWhitCreatorDB.content,
                postWhitCreatorDB.likes,
                postWhitCreatorDB.dislikes,
                postWhitCreatorDB.created_at,
                postWhitCreatorDB.updated_at,
                postWhitCreatorDB.creator_id,
                postWhitCreatorDB.creator_name
            )
            return post.toBusinessModel()
        })

        return posts
    }

    public createPost = async (input: CreatePostInputDTO): Promise<void> => {
        const { token, content } = input

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

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name


        const post = new Post(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> => {
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

        const postDB: PostDB | undefined = await this.postDatabase.findById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou a post pode editá-la")
        }

        const creatorName = payload.name


        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)

        post.setUpdatedAt(new Date().toISOString())
        const updatedPostDB = post.toDBModel()

        await this.postDatabase.update(idToEdit, updatedPostDB)
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
        const { token, idToDelete } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        const postDB: PostDB | undefined = await this.postDatabase.findById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (payload.role !== USER_ROLES.ADMIN
            && postDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou a post pode deletá-la")
        }

        await this.postDatabase.delete(idToDelete)
    }

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<void> => {
        const { token, idToLikeOrDislike, like } = input

        if (!token) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const postWithCreatorDB = await this.postDatabase
            .findPostsWithCreatorsById(idToLikeOrDislike)

        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
           
            if(like){
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            }else{
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {

            if(like){
              await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislikes()
                post.addLike()
            }else{
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislikes()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)
         
            if (like) {
                post.addLike()
            } else {
                post.addDislike()
            }
        }
        
        const updatedPostDB = post.toDBModel()

        await this.postDatabase.update(idToLikeOrDislike, updatedPostDB)
    }
}
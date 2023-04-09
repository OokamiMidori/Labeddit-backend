import  express  from "express"
import { CommentController } from "../controller/commentController"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDataBase } from "../database/CommentDataBase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import PostDatabase from "../database/PostDataBase"

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDataBase(),
        new IdGenerator(),
        new TokenManager(),
        new PostDatabase()
    )

)

commentRouter.get("/:id", commentController.getCommentsofPost)//Essa request deve ser passada a id do post e não do comment.
commentRouter.post("/:id", commentController.createComments)//Essa request tambem deve ser passada com a id do post.
commentRouter.put("/:id", commentController.editComments)//nessa deve passar o id do comment
commentRouter.delete("/:id", commentController.deleteComments)
commentRouter.put("/:id/like", commentController.likeOrDislikeComment)
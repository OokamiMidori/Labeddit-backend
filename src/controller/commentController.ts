import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentDTO, LikeOrDislikeCommentInputDTO, deleteCommentInputDTO, editCommentIpuntDTO, getCommentsInputDTO } from "../dtos/userDTO";
import { BaseError } from "../errors/BaseError";

export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness
    ) { }

    public getCommentsofPost = async (req: Request, res: Response) => {
        try {
            const input: getCommentsInputDTO = {
                token: req.headers.authorization,
                postId: req.params.id
            }
            const output = await this.commentBusiness.getCommentsOfPost(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createComments = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentDTO = {
                token: req.headers.authorization,
                content: req.body.content,
                postId: req.params.id
            }
            await this.commentBusiness.createComment(input)

            res.status(201).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editComments = async (req: Request, res: Response) => {
        try {
            const input: editCommentIpuntDTO = {
                idToEdit: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            }

            await this.commentBusiness.editComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Error inesperado")
            }
        }
    }

    public deleteComments = async (req: Request, res: Response) => {
        try {
            const input: deleteCommentInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            await this.commentBusiness.deleteComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.commentBusiness.likeOrDislikeComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}
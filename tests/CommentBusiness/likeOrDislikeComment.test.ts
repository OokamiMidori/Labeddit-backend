import { CommentBusiness } from "../../src/business/CommentBusiness";
import { LikeOrDislikeCommentInputDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../mocks/commentDatabaseMock";

describe("likeOrDislikeComment",()=>{
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock
    )
    test("Deve retornar undefined",async()=>{
        const input:LikeOrDislikeCommentInputDTO={
            token:"token-mock-normal",
            idToLikeOrDislike:"id-mock-comment",
            like:true
        }
        const result = await commentBusiness.likeOrDislikeComment(input)
        expect(result).toBe(undefined)
    })
})
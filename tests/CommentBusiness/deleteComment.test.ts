import { CommentBusiness } from "../../src/business/CommentBusiness";
import { deleteCommentInputDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../mocks/commentDatabaseMock";

describe("deleteComment",()=>{
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock
    )
    test("deve retornar undefined",async()=>{
        const input:deleteCommentInputDTO={
            token:"token-mock-normal",
            idToDelete:"id-mock-comment"
        }
        const result = await commentBusiness.deleteComment(input)
        expect(result).toBe(undefined)
    })
})
import { CommentBusiness } from "../../src/business/CommentBusiness";
import { CreateCommentDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../mocks/commentDatabaseMock";

describe("Create comment",()=>{
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock()
    )

    test("Retorna undefined mas não deve dar erro",async()=>{
        const input:CreateCommentDTO={
            token:"token-mock-normal",
            postId:"id-mock-post",
            content:"Teste"
        }
        const result = await commentBusiness.createComment(input)
        expect(result).toBe(undefined)
    })
})
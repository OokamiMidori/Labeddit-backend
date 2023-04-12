import { CommentBusiness } from "../../src/business/CommentBusiness";
import { editCommentIpuntDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../mocks/commentDatabaseMock";

describe("editComment",()=>{
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock
    )

    test("deve retornar undefined",async()=>{
        const input:editCommentIpuntDTO={
            token:"token-mock-normal",
            idToEdit:"id-mock-comment",
            content:"item editado"
        }

        const result = await commentBusiness.editComment(input)
        expect(result).toBe(undefined)
    })
})
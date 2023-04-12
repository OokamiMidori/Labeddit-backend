import { PostBusiness } from "../../src/business/PostBusiness";
import { LikeOrDislikePostInputDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";

describe("likeOrDislikePost",()=>{
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Deve retornar undefined",async()=>{
        const input:LikeOrDislikePostInputDTO={
            token:"token-mock-normal",
            idToLikeOrDislike:"id-mock-post",
            like:true
        }
        const result = await postBusiness.likeOrDislikePost(input)
        expect(result).toBe(undefined)
    })
})
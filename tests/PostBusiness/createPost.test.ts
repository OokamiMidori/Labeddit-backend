import {PostBusiness} from "../../src/business/PostBusiness"
import { CreatePostInputDTO, GetPostsInputDTO } from "../../src/dtos/userDTO"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import PostDatabaseMock from "../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"

describe("createPost",()=>{
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Deve retornar undefined", async()=>{
        const input:CreatePostInputDTO = {
            token:"token-mock-normal",
            content:"Teste"
        }
        const response = await postBusiness.createPost(input)
        expect(response).toBe(undefined)
    } )
})
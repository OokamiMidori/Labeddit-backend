import {PostBusiness} from "../../src/business/PostBusiness"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import PostDatabaseMock from "../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"

describe("deletePost",()=>{
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Deve retornar undefined",async()=>{
        const input = {
            token:"token-mock-normal",
            idToDelete:"id-mock-post"
        }
        const result = await postBusiness.deletePost(input)
        expect(result).toBe(undefined)
    })
})
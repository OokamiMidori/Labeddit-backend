import { PostBusiness } from "../../src/business/PostBusiness";
import { EditPostInputDTO } from "../../src/dtos/userDTO";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import PostDatabaseMock from "../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";

describe("editPost",()=>{
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Deve retornar undefined",async()=>{
        const input:EditPostInputDTO = {
            token:"token-mock-normal",
            content:"edited post test mock",
            idToEdit:"id-mock-post"            
        }
        const result = await postBusiness.editPost(input)
        expect(result).toBe(undefined)
    })
})
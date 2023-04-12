import { PostBusiness } from "../../src/business/PostBusiness"
import { GetPostsInputDTO } from "../../src/dtos/userDTO"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import PostDatabaseMock from "../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
describe("getPosts", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Deve retornar um post", async () => {
        const input: GetPostsInputDTO = {
            token: "token-mock-normal"
        }
        const response = await postBusiness.getPosts(input)
        expect(response).toContainEqual({
            "content": "Teste",
            "createdAt": "2023-04-10T21:07:37.119Z",
            "creator": {
                "id": "u001",
                "name": "Usuario teste"
            },
            "dislikes": 0, "id": "tp001",
            "likes": 0,
            "updatedAt": "2023-04-10T21:07:37.119Z"
        })
    })
})
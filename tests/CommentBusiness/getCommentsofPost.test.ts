import { CommentBusiness } from "../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { CommentDatabaseMock } from "../mocks/commentDatabaseMock"
import PostDatabaseMock from "../mocks/PostDatabaseMock"
import { getCommentsInputDTO } from "../../src/dtos/userDTO"

describe("getCommentsOfPost", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock()
    )

    test("Deve retornar um comentário de um post", async () => {
        const input: getCommentsInputDTO = {
            token: "token-mock-normal",
            postId: "id-mock-post"
        }
        const result = await commentBusiness.getCommentsOfPost(input)
        expect(result).toEqual([{
            "content": "comment mock test",
            "createdAt": "2023-04-10T21:07:37.119Z", "creator": {
                "id": "id-mock",
                "name": "Normal Mock"
            },
            "dislikes": 0,
            "id": "id-mock-comment",
            "likes": 0,
            "postId": "id-mock-post",
            "updatedAt": "2023-04-10T21:07:37.119Z"
        }])
    })
})
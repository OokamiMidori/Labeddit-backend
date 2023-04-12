import { BaseDatabase } from "../../src/database/BaseDatabase"
import { LikeDislikeDB, POST_LIKE, PostDB, PostWithCreatorDB } from "../../src/types"

export default class PostDatabaseMock extends BaseDatabase {

    public insert = async (postDB: PostDB) => {
        //não possui retorno.

    }

    public getPostsWithCreator = async (): Promise<PostWithCreatorDB[]> => {
        const result = [{
            id: "tp001",
            creator_id: "u001",
            content: "Teste",
            likes: 0,
            dislikes: 0,
            created_at: "2023-04-10T21:07:37.119Z",
            updated_at:  "2023-04-10T21:07:37.119Z",
            creator_name: "Usuario teste"
        }]
        return result
    }

    public findById = async (id: string) => {
        return {
            id: "id-mock-post",
            creator_id: "id-mock",
            content: "Teste-mock",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            creator_name: "Normal Mock"
        }
    }

    public update = async (id: string, postDB: PostDB): Promise<void> => {
        //não possui retorno
    }

    public delete = async (id: string): Promise<void> => {
       //não possui retorno
    }

    public findPostsWithCreatorsById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
       if (postId = "id-mock-post"){
        return{
            id:"id-mock-post",
            creator_id:"id-mock",
            content:"content Mock",
            likes:0,
            dislikes:0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            creator_name: "Normal Mock"
        }
       } else{
        return undefined
       }
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
     //não tem retorno
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {
        if(likeDislikeDBToFind){
            return POST_LIKE.ALREADY_LIKED
        }else{
                return null
            }
    }

    public removeLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        //não tem retorno
    }

    public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ) => {
       //não tem retorno
    }
}
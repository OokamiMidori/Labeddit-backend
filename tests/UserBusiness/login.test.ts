import { UserBusiness } from "../../src/business/UserBusiness";
import { LoginInputDTO } from "../../src/dtos/userDTO";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("Login",()=>{
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Login Bem sucedido com conta normal, retorna token",async ()=>{
        const input:LoginInputDTO = {
            email:"normal@email.com",
            password:"bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("Login bem sucedido com conta admin, retorna token",async()=>{
        const input:LoginInputDTO={
            email:"admin@email.com",
            password:"bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })
})
import * as supertest from "supertest";
import { app } from "../server";

const request = supertest.agent(app.listen());

describe("Username", () => {
  describe("GET /username", () => {
    it("should return username does not exists", () => {
      return request.get("/username/user-does-not-exists").expect(400, {
        message:
          "The username you are trying to retrieve (user-does-not-exists) doesn't exist in BNS"
      });
    });
    it("should return username data", () => {
      return request
        .get("/username/lucas")
        .expect(200, {
          id: "lucas",
          owner: "tiov1qcmdfwhs3j34e6usur3euf3y2z0het3u5p6a3z",
          addresses: [
            {
              chainId:
                "da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba",
              address: "4401556199488607253L"
            },
            {
              chainId: "bns-hugnet",
              address: "tiov1qcmdfwhs3j34e6usur3euf3y2z0het3u5p6a3z"
            },
            {
              chainId: "bov-hugnet",
              address: "tiov1e2e4zgysmuhf5pcnflu6smaeag0423rsrt5fy4"
            }
          ]
        });
    });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

describe("GET /", () => {
  it("should return Hello, World!", (done) => {
    chai
      .request("http://127.0.0.1:3010")
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Hello, World!\n");
        done();
      });
  });
});

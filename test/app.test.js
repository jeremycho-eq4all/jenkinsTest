const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const server = require("../app"); // 서버 파일을 불러옴

chai.use(chaiHttp);

describe("GET /", () => {
  let app;

  before((done) => {
    app = server.listen(3010, () => {
      console.log("Test server running on port 3010");
      done();
    });
  });

  after((done) => {
    app.close(() => {
      console.log("Test server stopped");
      done();
    });
  });

  it("should return Hello, World!", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Hello, World!\n");
        done();
      });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const server = require("../app");
const { execSync } = require("child_process");

chai.use(chaiHttp);

describe("GET /", () => {
  let app;

  before((done) => {
    console.log("into before");
    this.timeout(60000); // 1분 타임아웃 설정
    try {
      // 기존 서버 종료
      console.log("Try server to kill.");
      execSync(
        "lsof -i :3010 | grep LISTEN | awk '{print $2}' | xargs kill -9 || true"
      );
    } catch (e) {
      console.log("No existing server to kill.");
    }

    // 새로운 서버 시작
    app = server.listen(3010, () => {
      console.log("Test server running on port 3010");
      done();
    });
  });

  after((done) => {
    console.log("into after");
    this.timeout(60000); // 1분 타임아웃 설정
    if (app && app.close) {
      app.close(() => {
        console.log("Test server stopped");
        done();
      });
    } else {
      done();
    }
  });

  console.log("before if(should return hello, world");
  it("should return Hello, World!", (done) => {
    console.log("into if(should return hello, world");
    this.timeout(60000); // 1분 타임아웃 설정
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Hello, World!");
        done();
      });
  });
});

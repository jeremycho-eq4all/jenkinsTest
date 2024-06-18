const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const server = require("../app");
const { execSync } = require("child_process");
const os = require("os");

chai.use(chaiHttp);

describe("GET /", () => {
  let app;

  before((done) => {
    try {
      // 운영체제에 따라 다른 명령어를 실행
      if (os.platform() === "win32") {
        console.log("Try server to kill on Windows.");
        execSync(
          `for /F "tokens=5" %i in ('netstat -aon ^| findstr :3010 ^| findstr LISTENING') do taskkill /F /PID %i`
        );
      } else {
        console.log("Try server to kill on Unix/Linux.");
        execSync(
          `PID=$(netstat -tuln | grep ':3010' | awk '{print $7}' | cut -d'/' -f1)
          if [ -n "$PID" ]; then
            echo "Killing process $PID"
            kill -9 $PID
          fi`
        );
      }
    } catch (e) {
      console.log("No existing server to kill.");
    }

    // 새로운 서버 시작
    console.log("Starting test server...");
    app = server.listen(3010, () => {
      console.log("Test server running on port 3010");
      setTimeout(done, 5000); // 5초 기다렸다가 done 호출
    });
  });

  after((done) => {
    console.log("Stopping test server...");
    app.close(() => {
      console.log("Test server stopped");
      done();
    });
  });

  it("should return Hello, World!", (done) => {
    console.log("Sending request to server...");
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        if (err) done(err);
        console.log("Received response from server");
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Hello, World!\n");
        done();
      });
  });
});

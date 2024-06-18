const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../app");
const { execSync } = require("child_process");
const os = require("os");

chai.use(chaiHttp);

describe("GET /", () => {
  let server;

  before((done) => {
    try {
      if (os.platform() === "win32") {
        console.log("Trying to kill server on Windows.");
        execSync(
          `FOR /F "tokens=5" %P IN ('netstat -aon ^| findstr :3010 ^| findstr LISTENING') DO taskkill /F /PID %P`
        );
      } else {
        console.log("Trying to kill server on Unix.");
        execSync(
          `lsof -i :3010 | grep LISTEN | awk '{print $2}' | xargs kill -9`
        );
      }
    } catch (e) {
      console.log("No existing server to kill.");
    }

    console.log("Starting test server...");
    server = app.listen(3010, () => {
      console.log("Test server running on port 3010");
      setTimeout(done, 5000); // Ensure the server has time to start
    });
  });

  after((done) => {
    if (server) {
      console.log("Stopping test server...");
      server.close(() => {
        console.log("Test server stopped");
        done();
      });
    } else {
      done();
    }
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

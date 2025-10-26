const fs = require('fs');

const testFiles = [
  'jobs-api.test.js',
  'certifications-api.test.js',
  'file-upload-api.test.js',
  'projects-api.test.js'
];

testFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let fixed = content;

  // Replace setupTestData function
  const oldSetupPattern = /\/\/ Login user[\s\S]*?✓ User logged in successfully\}\);/;
  const newSetup = `  // Login user
  console.log("🔐 Logging in test user...");
  const loginResponse = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: testUser.email,
      password: "TestPassword123",
    })
    .expect(200);

  // Extract session cookie
  const cookies = loginResponse.headers["set-cookie"];
  sessionCookie = cookies ? cookies.find((cookie) => cookie.startsWith("connect.sid")) : null;

  if (!sessionCookie) {
    throw new Error("No session cookie received");
  }

  console.log(\`   ✓ User logged in successfully\`);`;

  fixed = fixed.replace(oldSetupPattern, newSetup);

  // Replace getFreshCsrfToken function  
  const oldGetTokenPattern = /async function getFreshCsrfToken\(\) \{[\s\S]*?\n\}/;
  const newGetToken = `async function getFreshCsrfToken() {
  // CSRF tokens are no longer required
  return "";`;

  fixed = fixed.replace(oldGetTokenPattern, newGetToken);

  fs.writeFileSync(file, fixed);
  console.log(`Fixed ${file}`);
});

console.log('All test files updated!');

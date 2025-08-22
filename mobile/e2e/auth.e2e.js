describe("Authentication Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show login screen on app launch", async () => {
    await expect(element(by.text("Welcome to MSMEBazaar"))).toBeVisible();
    await expect(element(by.text("Sign in to your account"))).toBeVisible();
  });

  it("should navigate to register screen", async () => {
    await element(by.text("Create Account")).tap();
    await expect(element(by.text("Join MSMEBazaar"))).toBeVisible();
  });

  it("should login with valid credentials", async () => {
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.text("Sign In")).tap();
    
    // Should navigate to dashboard after successful login
    await waitFor(element(by.text("Welcome back")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should show error for invalid credentials", async () => {
    await element(by.id("email-input")).typeText("invalid@example.com");
    await element(by.id("password-input")).typeText("wrongpassword");
    await element(by.text("Sign In")).tap();
    
    await expect(element(by.text("Login Failed"))).toBeVisible();
  });
});
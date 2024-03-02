export default async function registerUser(req) {
  try {
    const response = await fetch("http://localhost:8080/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "User registration failed" };
  }
}

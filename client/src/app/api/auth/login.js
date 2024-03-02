export default async function loginUser(req) {
  try {
    const response = await fetch("http://localhost:8080/users/login", {
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

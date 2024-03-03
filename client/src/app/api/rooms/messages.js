export async function getMessages(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch(
      `http://localhost:8080/messages/${request.roomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.token}`,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No messages found" };
  }
}

export async function createNewMessage(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch(`http://localhost:8080/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.token}`,
      },
      body: req,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "An error occurred while sending message" };
  }
}

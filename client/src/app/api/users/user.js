export async function getUserFromName(req) {
  //   const request = await JSON.parse(req);
  try {
    const response = await fetch(
      `http://localhost:8080/users/name/${req.userName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { success: false, error: "No room with given ID was found" };
  }
}

export async function getUserFromId(req) {
  try {
    const response = await fetch(
      `http://localhost:8080/users/id/${req.userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log({ data });
    return data.data;
  } catch (error) {
    return { success: false, error: "No room with given ID was found" };
  }
}

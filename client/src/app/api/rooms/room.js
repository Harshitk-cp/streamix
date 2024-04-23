export async function getRooms() {
  try {
    const response = await fetch("http://localhost:8080/room", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data.rooms;
  } catch (error) {
    return { success: false, error: "No Rooms Found" };
  }
}

export async function getRoomFromId(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch(
      `http://localhost:8080/room/${request.roomId}`,
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
    return { success: false, error: "No room with given ID was found" };
  }
}

export async function getRoomFromName(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch(
      `http://localhost:8080/room/name/${request.roomName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    return data.rooms || [];
  } catch (error) {
    return { success: false, error: "No room with given ID was found" };
  }
}

export async function createRoom(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch(`http://localhost:8080/room`, {
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
    return { success: false, error: "An error occurred while creating room" };
  }
}

export async function verifyRoom(req) {
  try {
    const response = await fetch(`http://localhost:8080/room/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No room found" };
  }
}

export async function deleteRoom(req) {
  try {
    const response = await fetch(
      `http://localhost:8080/room/${req.data.roomId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: req,
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No room found" };
  }
}

export async function updateRoom(req) {
  try {
    const response = await fetch(
      `http://localhost:8080/room/update/${req.data.roomId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: req,
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No room with given ID was found" };
  }
}

export async function removeUser(req) {
  try {
    const response = await fetch(`http://localhost:8080/room/remove/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: req,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No room with given ID was found" };
  }
}

export async function removeAllUser(req) {
  try {
    const response = await fetch(
      `http://localhost:8080/room/remove/users/${req.data.roomId}/all`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: req,
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, error: "No rooms found" };
  }
}

export async function createIngress(req) {
  const request = await JSON.parse(req);
  try {
    const response = await fetch("http://localhost:8080/room/createIngress", {
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
    return { success: false, error: "Failed to create Ingress" };
  }
}

export async function livekitWebhook(req) {
  try {
    const response = await fetch(
      "http://localhost:8080/room/webhooks/livekit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: req,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Failed to create Ingress" };
  }
}

export async function createToken(req) {
  try {
    const response = await fetch("http://localhost:8080/users/createToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Failed to create Ingress" };
  }
}

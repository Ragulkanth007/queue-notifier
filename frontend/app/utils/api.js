export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const join_queue = async (roomId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queue/room/${roomId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error joining queue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("join_queue error:", error);
    throw error;
  }
}

export const leave_queue = async (roomId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queue/room/${roomId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error leaving queue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("leave_queue error:", error);
    throw error;
  }
}

export const cancel_queue = async (queueId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queue/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ queueId }),
    });

    if (!response.ok) {
      throw new Error(`Error canceling queue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("cancel_queue error:", error);
    throw error;
  }
}

export const get_queues_by_room = async (roomId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queue/room/${roomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching queues: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("get_queues_by_room error:", error);
    throw error;
  }
}

export const get_rooms = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`Error fetching rooms: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error("get_rooms error:", error);
    throw error;
  }
};

export const get_room = async (roomId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("get_room error:", error);
    throw error;
  }
}

export const create_room = async (roomData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("create_room error:", error);
    throw error;
  }
}

export const get_users = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("get_users error:", error);
    throw error;
  }
};

export const get_user_by_id = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("get_user_by_id error:", error);
    throw error;
  }
}

export const promote_user = async (userId, role, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/promote/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role : role }),
    });

    if (!response.ok) {
      throw new Error(`Error promoting user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("promote_user error:", error);
    throw error;
  }
}

export const demote_user = async (userId, role, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/demote/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: role }),
    });

    if (!response.ok) {
      throw new Error(`Error demoting user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("demote_user error:", error);
    throw error;
  }
}

export const get_user_queues = async(userId, token) => {
  try{

    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const res = await fetch(`${API_BASE_URL}/queue/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) throw new Error("Failed to fetch queues");
    return res.json();
  } catch (error) {
    console.error("get_user_queues error:", error);
    throw error;
  }
}

export const kick_from_queue = async (queueId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queue/kick/${queueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error kicking from queue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("kick_from_queue error:", error);
    throw error;
  }
}
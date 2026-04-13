const login = async (email, password) => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  const token =
    response.data.token || response.data.data?.token;

  const user =
    response.data.user || response.data.data?.user;

  if (!token) {
    throw new Error("Token not received from backend");
  }

  localStorage.setItem("token", token);
  setToken(token);
  setUser(user);

  return response.data;
};

/* =============================== */
/* REGISTER FIX */
/* =============================== */

const register = async (userData) => {
  const response = await api.post("/api/auth/register", userData);

  const token =
    response.data.token || response.data.data?.token;

  const user =
    response.data.user || response.data.data?.user;

  if (!token) {
    throw new Error("Token not received from backend");
  }

  localStorage.setItem("token", token);
  setToken(token);
  setUser(user);

  return response.data;
};
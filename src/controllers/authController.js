import * as authService from "../services/auth.js";

export const register = async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

export const login = async (req, res) => {
  const { accessToken } = await authService.login(req.body, res);

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken },
  });
};

export const refresh = async (req, res) => {
  const { accessToken } = await authService.refresh(req, res);

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken },
  });
};

export const logout = async (req, res) => {
  await authService.logout(req, res);

  res.status(204).send();
};

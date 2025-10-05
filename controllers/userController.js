import fs from "fs";
import path from "path";

const dataPath = path.resolve("data/users.json");

const readUsers = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

const writeUsers = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET all users
export const getAllUsers = (req, res) => {
  const users = readUsers();
  res.json(users);
};

// GET user by ID
export const getUserById = (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// POST (create )
export const createUser = (req, res) => {
  const users = readUsers();
  const { name, email } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
  };

  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: "User created", user: newUser });
};

// PUT (update )
export const updateUser = (req, res) => {
  const users = readUsers();
  const { id } = req.params;
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === parseInt(id));
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  // Check email validation
  if (email && users.some((u) => u.email === email && u.id !== parseInt(id))) {
    return res.status(400).json({ message: "Email already exists" });
  }

  users[userIndex] = { ...users[userIndex], name, email };
  writeUsers(users);
  res.json({ message: "User updated", user: users[userIndex] });
};

// DELETE
export const deleteUser = (req, res) => {
  let users = readUsers();
  const { id } = req.params;

  const userExists = users.some((u) => u.id === parseInt(id));
  if (!userExists) return res.status(404).json({ message: "User not found" });

  users = users.filter((u) => u.id !== parseInt(id));
  writeUsers(users);
  res.json({ message: "User deleted" });
};

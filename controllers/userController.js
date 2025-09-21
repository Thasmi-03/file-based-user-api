const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/users.json");

// Helper function → file படிக்க
function readData() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Helper function → file எழுத
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all users
exports.getAllUsers = (req, res) => {
  const users = readData();
  res.json(users);
};

// GET single user
exports.getUserById = (req, res) => {
  const users = readData();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// POST create user
exports.createUser = (req, res) => {
  const users = readData();
  const { name, email } = req.body;

  // Duplicate email check
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  writeData(users);

  res.status(201).json({ message: "User created", user: newUser });
};

// PUT update user
exports.updateUser = (req, res) => {
  const users = readData();
  const { id } = req.params;
  const { name, email } = req.body;

  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  // Duplicate email check (other than self)
  if (users.find(u => u.email === email && u.id !== parseInt(id))) {
    return res.status(400).json({ message: "Email already exists" });
  }

  users[userIndex] = { ...users[userIndex], name, email };
  writeData(users);

  res.json({ message: "User updated", user: users[userIndex] });
};

// DELETE user
exports.deleteUser = (req, res) => {
  let users = readData();
  const { id } = req.params;

  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(userIndex, 1);
  writeData(users);

  res.json({ message: "User deleted", user: deletedUser });
};

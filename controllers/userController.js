const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "../data/users.json");
// :repeat: Utility functions
function readUsersFromFile() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}
function writeUsersToFile(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}
function generateNewId(users) {
  const ids = users.map((user) => user.id);
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}
// :inbox_tray: GET All Users
exports.getUsers = (req, res) => {
  try {
    const users = readUsersFromFile();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error reading users." });
  }
};
// :inbox_tray: GET User by ID
exports.getUser = (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user." });
  }
};
// :heavy_plus_sign: POST Create User
exports.createUser = (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email required" });
    const users = readUsersFromFile();
    // Check for duplicate email
    const existing = users.find((u) => u.email === email);
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const newUser = {
      id: generateNewId(users),
      name,
      email,
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};
// :pencil2: PUT Update User
exports.updateUser = (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = parseInt(req.params.id);
    const users = readUsersFromFile();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1)
      return res.status(404).json({ message: "User not found" });
    // Check for duplicate email (excluding self)
    const duplicate = users.find((u) => u.email === email && u.id !== userId);
    if (duplicate)
      return res.status(400).json({ message: "Email already in use" });
    users[index] = { id: userId, name, email };
    writeUsersToFile(users);
    res.json({ message: "User updated", user: users[index] });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};
// :x: DELETE User
exports.deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readUsersFromFile();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1)
      return res.status(404).json({ message: "User not found" });
    const deleted = users.splice(index, 1);
    writeUsersToFile(users);
    res.json({ message: "User deleted", user: deleted[0] });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

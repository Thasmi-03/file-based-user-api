const fs = require("fs"); // Load File System module to read/write files
const path = require("path"); // Load Path module to work with file paths

const filePath = path.join(__dirname, "../data/users.json");

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

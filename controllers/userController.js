const fs = require("fs"); // Load File System module to read/write files
const path = require("path"); // Load Path module to work with file paths


const filePath = path.join(__dirname, "../data/users.json");


exports.getAllUsers = (req, res) => {
  
  const users = readUsersFromFile();

  
  res.json(users);
};
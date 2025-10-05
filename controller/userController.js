// Helper functions
async function readUsers() {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

// GET all users
export async function getAllUsers(req, res) {
  const users = await readUsers();
  res.json(users);
}

// GET user by ID
export async function getUserById(req, res) {
  const users = await readUsers();
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

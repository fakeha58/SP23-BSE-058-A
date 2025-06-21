// In-memory user storage (replace with database in production)
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date('2024-01-01')
  }
];

let nextId = 2;

const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find(user => user.id === id);
};

const createUser = (userData) => {
  const newUser = {
    id: nextId++,
    ...userData,
    createdAt: new Date()
  };
  users.push(newUser);
  return newUser;
};

const updateUser = (id, updates) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return null;
};

module.exports = {
  users,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser
};
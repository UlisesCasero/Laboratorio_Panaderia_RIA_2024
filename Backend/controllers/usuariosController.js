const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mail = require('nodemailer/lib/mailer');
const { enviar_mail_cambio_constrasenia, enviar_reset_constrasenia, enviar_mail } = require('../templates/registro');
const usuarios = [];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

// Función para crear usuarios por defecto
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'maria.sellanes@estudiantes.utec.edu.uy', password: 'admin123', role: 'ADMIN', telefono: '123456789' },
    { email: 'panadero@example.com', password: 'panadero123', role: 'PANADERO', telefono: '987654321' },
    { email: 'user@example.com', password: 'user123', role: 'USER', telefono: '456123789' },
    { email: 'user@example.com2', password: 'user123', role: 'USER', telefono: '987654321' },
    { email: 'user@example.com3', password: 'user123', role: 'USER', telefono: '456123789' },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      telefono: user.telefono,
      enabled: true,
    };
    usuarios.push(newUser);
  }
};

// Llama a la función para crear usuarios por defecto al inicio
//createDefaultUsers();

const register = async (req, res) => {
  const { email, password, role, telefono } = req.body;
  const existingUser = usuarios.find(user => user.email === email);
  if (existingUser) {
    return res.json({ message: 'Este email ya se encuentra registrado', userExists: true });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    email,
    password: hashedPassword,
    role,
    telefono,
    enabled: true,
  };
  usuarios.push(newUser);
  enviar_mail(email); 
  res.status(201).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateToken(user);
    res.json({ token, id: user.id, nombre: user.email, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

/*const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user && bcrypt.compare(bcrypt.hash(oldPassword, 10)), user.password) {
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated' });
    enviar_mail_cambio_constrasenia(user.email);
  } else {
    res.status(400).json({ message: 'Invalid password' });
  }
};
*/

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = usuarios.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
const desencriptar = (oldPassword)=>{
  const passwordDesencriptada = crypto.createDecipheriv(oldPassword);
}
  if (isMatch) {
    // Hashea la nueva contraseña antes de almacenarla
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    res.json({ message: 'Contraseña actualizada' });
    // enviar_mail_cambio_constrasenia(user.email);
  } else {
    res.status(400).json({ message: 'Contraseña antigua incorrecta' });
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  const user = usuarios.find(u => u.email === email);
  if (user) {
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
    const resetLink = `http://localhost:4200/usuarios/reset-password?token=${token}&id=${user.id}&psw=${user.password}`;
    enviar_reset_constrasenia(user.email, resetLink);
    res.json({ message: 'Password reset link sent', resetLink });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const enableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = true;
    res.json({ message: 'User enabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const disableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = false;
    res.json({ message: 'User disabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getAllUsers = (req, res) => {
  res.json(usuarios);
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const users = usuarios.find(i => i.id == id);
  if (users) {
    res.json(users);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

const obtenerUserById = (id) => {
  return new Promise((resolve, reject) => {
    const user = usuarios.find(u => u.id == id);
    if (user) {
      resolve(user);
    } else {
      reject(new Error('Usuario no encontrado'));
    }
  });
};

const getUserByEmail = (req, res) => {
  const { email } = req.params;
  const user = usuarios.find(u => u.email === email);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, password, telefono, role } = req.body;
  const userIndex = usuarios.findIndex(u => u.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (email) usuarios[userIndex].email = email;
  if (password) usuarios[userIndex].password =  hashedPassword;
  if (telefono) usuarios[userIndex].telefono = telefono;
  if (role) usuarios[userIndex].role = role;

  res.json({ message: 'Usuario actualizado correctamente', usuario: usuarios[userIndex] });
};
module.exports = {
  usuarios,
  createDefaultUsers,
  register,
  login,
  changePassword,
  forgotPassword,
  enableUser,
  disableUser,
  getAllUsers,
  getUserById,
  obtenerUserById,
  getUserByEmail,
  updateUsuario
};

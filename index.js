const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔹 Servir archivos estáticos (CSS, imágenes, JS si tienes)
app.use(express.static(__dirname));

// 🔹 Rutas explícitas para HTML
app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 🔹 Archivo donde guardamos usuarios
const USERS_FILE = path.join(__dirname, 'users.json');

// Leer usuarios
function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch {
        return [];
    }
}

// Guardar usuarios
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🔹 REGISTER
app.post('/register', (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
    }

    let users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    users.push({ email, password });
    writeUsers(users);

    console.log(`Usuario registrado: ${email}`);
    res.json({ success: true, message: 'Registro exitoso', user: email });
});

// 🔹 LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    let users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        console.log(`Usuario conectado: ${email}`);
        return res.json({ success: true, message: 'Login exitoso', user: email });
    }

    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});
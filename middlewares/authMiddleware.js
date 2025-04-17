// middlewares/authMiddleware.js

const authMiddleware = (req, res, next) => {
  // --- Toda la lógica debe estar DENTRO de esta función ---

  console.log('>>>> Ejecutando Auth Middleware para:', req.path); // Logging
  console.log('>>>> Estado de req.session:', req.session); // Logging
  console.log('>>>> Valor de req.session.authUser:', req.session?.authUser); // Logging seguro

  // Verificar si existe la variable de sesión authUser y es true
  if (req.session && req.session.authUser === true) {
    console.log('>>>> Usuario AUTENTICADO. Continuando...'); // Logging
    return next(); // Usuario autenticado, continuar
  } else {
    console.log('>>>> Usuario NO AUTENTICADO. Redirigiendo a /login...'); // Logging
    // Asegurarnos de que no intentamos redirigir si ya estamos en /login para evitar bucles
    if (req.path === '/login') {
        return next(); // Si ya está en login, no redirigir de nuevo
    }
    return res.redirect('/login'); // Usuario no autenticado, redirigir a login
  }
  // --- Fin de la lógica dentro de la función ---
};

export default authMiddleware; // Asegúrate de que sea export default

// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  if (req.session.authUser) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

  console.log('>>>> Ejecutando Auth Middleware para:', req.path); // Logging
  console.log('>>>> Estado de req.session:', req.session); // Logging
  console.log('>>>> Valor de req.session.authUser:', req.session?.authUser); // Logging seguro

  // Verificar si existe la variable de sesión authUser y es true
  if (req.session && req.session.authUser === true) {
    console.log('>>>> Usuario AUTENTICADO. Continuando...'); // Logging
    return next(); // Usuario autenticado, continuar
  } else {
    console.log('>>>> Usuario NO AUTENTICADO. Redirigiendo a /login...'); // Logging
    return res.redirect('/login'); // Usuario no autenticado, redirigir a login
  }

export default authMiddleware;

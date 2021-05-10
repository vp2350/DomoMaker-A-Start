const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.post('/getDomosByName', mid.requiresLogin, controllers.Domo.getDomosByName);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/password', mid.requiresLogin, controllers.Account.passwordPage);
  app.post('/password', mid.requiresLogin, controllers.Account.password);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/search', mid.requiresLogin, controllers.File.searchPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.get('/upload', controllers.File.uploadPage);
  app.post('/upload', controllers.File.uploadFile);
  app.get('/retrieve', controllers.File.retrieveFile);
  app.get('/getOwnerFiles', mid.requiresLogin, controllers.File.retrieveOwnerFiles);
  app.get('/getFilesByUsername', mid.requiresLogin, controllers.File.retrieveFilesByUserName);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

const models = require('../models');

const {
  Account,
} = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const passwordPage = (req, res) => {
  res.render('password', { csrfToken: req.csrfToken() });
}; 

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password!',
      });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({
      redirect: '/maker',
    });
  });
};
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match!',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);

      return res.json({
        redirect: '/maker',
      });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username already in use.',
        });
      }

      return res.status(400).json({
        error: 'An error occureed',
      });
    });
  });
};

const password = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${request.session.account.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match!',
    });
  }
  
  
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const query = {'username': req.body.username};
    //https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
    Account.AccountModel.findOneAndUpdate(query, accountData, {upsert: true}, function(err, doc){
        if(err) return res.send(500, {error: err});
        return res.status(200, {message: "SUCCESSFULLY CHANGED PASSWORD"});
    });
    
  });
  
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.signup = signup;
module.exports.logout = logout;
module.exports.getToken = getToken;
module.exports.passwordPage = passwordPage;
module.exports.password = password;
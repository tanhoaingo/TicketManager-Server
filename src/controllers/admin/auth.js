const User = require('../../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: 'Admin email already registered hihi',
      });
  });

  User.findOne({ username: req.body.username }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: 'Admin username already registered',
      });
  });

  const { firstName, lastName, email, password, username, contactNumber } = req.body;

  const hash_password = await bcrypt.hash(password, 10);

  const _user = new User({
    firstName,
    lastName,
    email,
    hash_password,
    username,
    role: 'admin',
    contactNumber,
  });

  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({
        message: 'Something went wrong',
      });
    }
    if (data) {
      return res.status(201).json({
        message: 'Admin create successfully',
      });
    }
  });
};

exports.signin = async (req, res) => {
  let myUser;

  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ success: false, error });
    myUser = user;
  });

  myUser = await User.findOne({ email: req.body.email });
  if (myUser) {
    const match = await bcrypt.compareSync(req.body.password, myUser.hash_password);
    if (match && myUser.role === 'admin') {
      const token = jwt.sign({ id: myUser.id, role: myUser.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.cookie('token', token, { expiresIn: '1h' });
      const { _id, firstName, lastName, email, role, fullName } = myUser;
      console.log(myUser);
      res.status(200).json({
        token,
        myUser: {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName,
        },
      });
    } else {
      return res.status(401).json({
        message: 'Your username or password may be incorrect',
      });
    }
  } else {
    return res.status(501).json({ message: 'Something went wrong' });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Signout successfully...!',
  });
};

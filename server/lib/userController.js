import { body, oneOf, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';
import encrypt from 'quick-encrypt';
import fs from 'fs';
import sendPasswordResetMail from './utils/mail';
import config from './config';

const keys = encrypt.generate(1024); // Use either 2048 bits or 1024 bits.
const publicKey = keys.public;
const privateKey = keys.private;

let persitantKeys = null;
fs.readFile(config.KEYS_PATH, (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      persitantKeys = encrypt.generate(1024); // Use either 2048 bits or 1024 bits.
      fs.writeFile(config.KEYS_PATH, JSON.stringify(persitantKeys), (err) => {
        if (err) throw err;
      });
      return;
    } throw err;
  }
  persitantKeys = JSON.parse(data);
});

function validateGroupsIds(db, groupIds) {
  return groupIds
    .map((groupId) => {
      if (!db.get('groups').find({ id: groupId }).value()) {
        return {
          param: 'groups',
          msg: 'group does not exist',
        };
      }
    })
    .filter((e) => e);
}

function validatePassword(password, confirm) {
  const errors = [];
  if (password !== confirm) {
    errors.push({
      param: 'password',
      msg: 'password missmatch',
    });
    errors.push({
      param: 'confirm',
      msg: 'password missmatch',
    });
  }
  if (password.length < 4) {
    errors.push({
      param: 'password',
      msg: 'password should be at least 4 characters',
    });
  }
  return errors;
}

export default function userController({ app, db, authMiddleware }) {
  app.get('/encrypt', (req, res) => {
    res.send(publicKey);
  });
  app.post('/login', (req, res) => {
    const { email } = req.body;

    const decryptedPassword = encrypt.decrypt(req.body.password, privateKey);
    if (!email.length || !decryptedPassword || !decryptedPassword.length) {
      return res.status(401).send('Wrong email or password');
    }
    const user = db.get('users').find({ email }).value();
    if (
      !user
      || encrypt.decrypt(user.password, persitantKeys.private)
        !== decryptedPassword
    ) {
      return res.status(401).send('Wrong email or password');
    }
    const token = uuid();
    db.get('users').find({ id: user.id }).assign({ token }).write();
    res.status(201).json({ token });
  });

  app.get('/user', authMiddleware, (req, res) => {
    const users = db.get('users').value();
    res.send(
      users.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        groups: user.groups,
        badges: user.badges,
        email: user.email,
        isAdmin: user.isAdmin,
      })),
    );
  });
  app.get('/user/:id', authMiddleware, (req, res) => {
    if (req.params.id === 'new') {
      return res.send({
        firstname: '',
        lastname: '',
        groups: [],
        badges: [],
        email: '',
        isAdmin: false,
      });
    }
    const user = db.get('users').find({ id: req.params.id }).value();
    res.send({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      groups: user.groups,
      badges: user.badges,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });

  app.post(
    '/user',
    authMiddleware,
    [
      body('lastname').isString().notEmpty(),
      body('firstname').isString().notEmpty(),
      oneOf([
        body('isAdmin').equals('false'),
        [
          body('isAdmin').equals('true'),
          body('email').isString().notEmpty(),
          body('password').isString().notEmpty(),
          body('confirm').isString().notEmpty(),
        ],
      ]),
      body('groups').isArray(),
      body('badges').isArray(),
    ],
    (req, res) => {
      const errors = validationResult(req).array();
      if (errors.length) {
        return res.status(400).json({ errors });
      }

      if (req.body.isAdmin) {
        try {
          const { password, confirm } = req.body;
          // TODO: add confirm
          const decryptedPassword = encrypt.decrypt(
            password,
            privateKey,
          );
          const decryptedConfirm = encrypt.decrypt(
            confirm,
            privateKey,
          );
          errors.push(...validatePassword(decryptedPassword, decryptedConfirm));
        } catch (e) {
          // TODO: use utils to handle the error and avoid sending the key
          errors.push('something went wront on decrypt1');
          return res.status(500).json({ errors });
        }
      }
      errors.push(...validateGroupsIds(db, req.body.groups));
      if (!persitantKeys) {
        return res.status(400);
      }
      if (errors.length) {
        return res.status(400).json({ errors });
      }
      if (req.body.password) {
        try {
          req.body.password = encrypt.encrypt(
            encrypt.decrypt(req.body.password, privateKey),
            persitantKeys.public,
          );
        } catch (e) {
          errors.push('something went wront on decrypt2');
          return res.status(500).json({ errors });
        }
      }

      // ensure only one user owns a badge
      if (req.body.badges) {
        req.body.badges = req.body.badges.filter((b) => b);
        // unassign badges from other users:
        const otherUsers = db.get('users')
          .filter(({ badges, id }) => badges.length && id !== req.body.id)
          .value();
        otherUsers.forEach((otherUser) => {
          let shouldUpdate = false;
          let { badges } = otherUser;
          req.body.badges.forEach((badge) => {
            if (!otherUser.badges.includes(badge)) return;
            shouldUpdate = true;
            badges = badges.filter((b) => b !== badge);
          });
          if (!shouldUpdate) return;
          otherUser.badges = badges;
          db.get('users').find({ id: otherUser.id }).assign(otherUser).write();
        });
      }
      // modify entry
      if (req.body.id) {
        db.get('users').find({ id: req.body.id }).assign(req.body).write();
      } else {
        // make new entry
        db.get('users')
          .push({ id: uuid(), ...req.body })
          .write();
      }
      res.sendStatus(200);
    },
  );

  app.delete('/user/:id', authMiddleware, (req, res) => {
    db.set(
      'users',
      db
        .get('users')
        .filter(({ id }) => id !== req.params.id)
        .value(),
    ).write();
    res.sendStatus(200);
  });

  app.get('/user/reset/:email', (req, res) => {
    const user = db
      .get('users')
      .find(({ email }) => email === req.params.email)
      .value();

    const resetToken = {
      date: Date.now(),
      hash: uuid(),
    };

    db.get('users').find({ id: user.id }).assign({
      ...user,
      resetToken,
    }).write();
    res.sendStatus(200);
  });
  app.post('/user/resetpassword', (req, res) => {
    const user = db
      .get('users')
      .find(({ email }) => email === req.body.email)
      .value();

    if (!user) res.sendStatus(500);

    const resetToken = {
      date: Date.now(),
      hash: uuid(),
    };
    return config
      .getValue('domain')
      .then((domain) => sendPasswordResetMail({
        destination: user.email,
        url: `${domain}password-reset/${resetToken.hash}`,
      }))
      .then(() => {
        db.get('users')
          .find({ id: user.id })
          .assign({
            ...user,
            resetToken,
          })
          .write();
        res.sendStatus(200);
      })
      .catch((e) => {
        res.sendStatus(400);
      });
  });

  app.post('/user/setpassword', (req, res) => {
    const { token } = req.body;
    const user = db
      .get('users')
      .find((user) => user.resetToken && user.resetToken.hash === token)
      .value();
    // token not found or outdated
    if (!user) {
      return res.sendStatus(500);
    }
    if (!user || Date.now() - user.resetToken.date > 2 * 36 * 1e5) {
      return res.sendStatus(400).json({ diff: Date.now() - user.resetToken.date });
    }

    const password = encrypt.decrypt(req.body.password, privateKey);
    const confirm = encrypt.decrypt(req.body.confirm, privateKey);
    const errors = validatePassword(password, confirm);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    // everything is fine, set the password.
    delete user.resetToken;
    user.password = encrypt.encrypt(password,
      persitantKeys.public);
    db.get('users').find({ id: user.id }).assign(user).write();
    res.sendStatus(500);
  });
}

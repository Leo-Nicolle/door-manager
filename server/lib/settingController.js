import { validationResult } from 'express-validator';
import fs from 'fs';
import config from './config';

export default function settingController({ app, authMiddleware }) {
  app.get('/settings', authMiddleware, (req, res) => config.getValue('CONFIG_PATH')
    .then((settingsPath) => {
      fs.readFile(settingsPath, (e, data) => {
        if (e) throw (e);
        res.send(data);
      });
    })
    .catch((e) => {
      console.log('error', e);
      res.status(500).json(e);
    }));

  app.post(
    '/settings',
    authMiddleware,
    [],
    (req, res) => {
      const errors = validationResult(req).array();
      if (errors.length) {
        return res.status(422).json({ errors });
      }
      config.getValue('CONFIG_PATH', req.body)
        .then((settingsPath) => {
          fs.writeFile(settingsPath, JSON.stringify(req.body, 0, 2), (e) => {
            if (e) throw (e);
            config.refresh();
            res.sendStatus(200);
          });
        })
        .catch((e) => {
          console.log('error', e);
          res.status(500).json(e);
        });
    },
  );
}

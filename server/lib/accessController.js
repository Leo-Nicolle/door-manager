import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

export default function accessController({ app, db, authMiddleware }) {
  app.get("/access/:doorid", (req, res) => {
    // const door = db.get("doors").find({ id: req.params.doorid }).value();

    const groupIds = db
      .get("groups")
      .value()
      .map(({ doorAccess }) => doorAccess[req.params.doorid])
      .filter((e) => e);

    const schedules = groupIds.reduce(
      (schedules, id) =>
        schedules.concat(db.get("schedules").find({ id }).value()),
      []
    );

    const badges = db
      .get("users")
      .value()
      .reduce((badges, user) => {
        if (
          !user.groups.some((id) => groupIds.some((groupId) => groupId === id))
        ) {
          return badges;
        }
        badges.push(user.groups);
        return badges;
      }, []);
    res.send(badges);
  });

  app.delete("/access", authMiddleware, (req, res) => {
    console.log(req.body, req.params);
  });
}

export default function logController({ app, db, authMiddleware }) {
  app.get("/log", authMiddleware, (req, res) => {
    const logs = db.get("logs").value();
    res.send(logs);
  });
  app.get("/log/:id", authMiddleware, (req, res) => {
    const log = db.get("logs").find({ id: req.params.id }).value();
    res.send(log);
  });
  app.delete("/log/:id", authMiddleware, (req, res) => {
    db.set(
      "logs",
      db
        .get("logs")
        .filter(({ id }) => id !== req.params.id)
        .value()
    ).write();

    res.send(200);
  });

  app.delete("/log", authMiddleware, (req, res) => {
    db.set("logs", []).write();
    res.send(200);
  });
}
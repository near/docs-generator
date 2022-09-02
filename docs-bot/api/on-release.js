import * as express from "express";

const { createNodeMiddleware, createProbot } = require("probot");

const app = (app, { getRouter }) => {
  const router = getRouter("/");
  router.use(express.json())
  router.post("/on-release", async (req, res) => {
    if (req.headers["authorization"] !== `Bearer ${process.env.DOCS_BOT_SECRET}`) {
      res.sendStatus(401);
      return;
    }
    if (
      !req.body["event_type"]
      || !req.body["client_payload"]["source_repo"]
      || !req.body["client_payload"]["builder_name"]
      || !req.body["client_payload"]["release_version"]
    ) {
      res.sendStatus(400);
    } else {
      const [owner, repo] = req.body["client_payload"]["source_repo"].split('/');
      // Use app level scope to find our installation id
      console.log(req.body);
      let app_client = await app.auth();
      let { data: { id } } = await app_client.apps.getRepoInstallation({
        owner: 'maxhr',
        repo: 'near--docs',
      });

      // Use installation scope to fire the repository_dispatch
      let client = await app.auth(id);
      await client.repos.createDispatchEvent({
        owner,
        repo,
        event_type: req.body["event_type"],
        client_payload: req.body["client_payload"],
      });

      res.sendStatus(200);
    }
  });
  router.use((req, res) => {
    res.send('unknown');
  })
}
//
// module.exports = createNodeMiddleware(app, {
//   probot: createProbot(),
// });

module.exports = async function handler(req, res) {
  const probot = createProbot();
  if (req.headers["authorization"] !== `Bearer ${process.env.DOCS_BOT_SECRET}`) {
    res.status(401);
    res.end();
    return;
  }
  if (
    !req.body["event_type"]
    || !req.body["client_payload"]["source_repo"]
    || !req.body["client_payload"]["builder_name"]
    || !req.body["client_payload"]["release_version"]
  ) {
    res.status(400);
    res.end();
    return;
  } else {
    const [owner, repo] = req.body["client_payload"]["source_repo"].split('/');
    // Use app level scope to find our installation id
    console.log(req.body);
    let app_client = await probot.auth();
    let { data } = await app_client.apps.getRepoInstallation({
      owner: 'maxhr',
      repo: 'near--docs',
    });
    console.log(">>>>>>> ", data)
    // Use installation scope to fire the repository_dispatch
    console.log(">>>>>>> ", owner, repo, data.id);
    let client = await probot.auth(data.id);
    await client.repos.createDispatchEvent({
      owner: 'maxhr',
      repo: 'near--docs',
      event_type: req.body["event_type"],
      client_payload: req.body["client_payload"],
    });
    res.status(200);
    res.end();
  }
};

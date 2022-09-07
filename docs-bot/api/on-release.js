const { createProbot } = require("probot");

module.exports = async function handler(req, res) {
  const probot = createProbot();
  if (req.headers["bot-auth"] !== `${process.env.DOCS_BOT_SECRET}`) {
    res.status(401);
    res.send('401');
    res.end();
    return;
  }
  if (
    !req.body
    || !req.body["event_type"]
    || !req.body["client_payload"]["source_repo"]
    || !req.body["client_payload"]["builder_name"]
    || !req.body["client_payload"]["release_version"]
  ) {
    res.status(400);
    res.send('bad params');
    res.end();
    return;
  } else {
    const [owner, repo] = req.body["client_payload"]["source_repo"].split('/');
    // Use app level scope to find our installation id
    console.log(">>>>>>> req.body", req.body);
    let app_client = await probot.auth();
    let { data } = await app_client.apps.getRepoInstallation({
      owner: 'maxhr',
      repo: 'near--docs',
    });
    console.log(">>>>>>> data", data)
    // Use installation scope to fire the repository_dispatch
    console.log(">>>>>>> owner, repo, data.id", owner, repo, data.id);
    let client = await probot.auth(data.id);
    try {
      const dispatchResponse = await client.repos.createDispatchEvent({
        owner: 'maxhr',
        repo: 'near--docs',
        event_type: req.body["event_type"],
        client_payload: req.body["client_payload"],
      });
      console.log(">>>>>>> dispatchResponse", dispatchResponse);
    } catch (e) {
      console.error(e);
      res.status(500);
      res.send('error');
      res.end();
      return;
    }
    res.status(200);
    res.send('ok');
    res.end();
    return;
  }
};

const { createProbot } = require("probot");

module.exports = async function handler(req, res) {
  const probot = createProbot()
  if (req.headers["bot-auth"] !== `${process.env.DOCS_BOT_SECRET}`) {
    res.status(401);
    res.send('401');
    res.end();
    return;
  }
  if (
    !req.body
    || !req.body["event_type"]
    || req.body["event_type"] !== 'docs-build-finished'
    || !req.body["client_payload"]["pr_head_branch"]
  ) {
    res.status(400);
    res.send('bad params');
    res.end();
    return;
  } else {
    const { pr_head_branch } = req.body["client_payload"];
    const owner = process.env.APP_REPO_OWNER || 'near';
    const repo = process.env.APP_REPO_NAME || 'docs';
    // Use app level scope to find our installation id
    console.log(">>>>>>> req.body", req.body);
    try {
      let app_client = await probot.auth();
      let { data } = await app_client.apps.getRepoInstallation({
        owner,
        repo,
      });
      console.log(">>>>>>> data", data)

      let client = await probot.auth(data.id);

      const prResponse = await client.pulls.create({
        owner,
        repo,
        head: pr_head_branch,
        base: 'master',
        title: `Generated ${pr_head_branch}`
      });
      console.log(">>>>>>> prResponse", prResponse);
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
  }
};

import {publish} from './publish';

(async function() {
  console.log(process.env.GITHUB_CONTEXT);
  // const ghEvent = process.argv[2];
  // if (ghEvent) {
  //   const parsedEvent = JSON.parse(ghEvent);
  //   if (parsedEvent.type) {
  //     publish([parsedEvent.source], parsedEvent.tag || null);
  //   }
  // } else {
  //   publish(['naj'], null);
  // }
})();
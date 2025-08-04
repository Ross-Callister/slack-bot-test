import { App, BlockAction, LogLevel } from "@slack/bolt";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import registerListeners from "./listeners";

console.log(process.env);

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// 2. Listen for the button click and update the message
app.action<BlockAction>("hide_details_button", async ({ ack, body, client }) => {
  // Acknowledge the button click
  await ack();

  // The 'body' contains the original message's identifiers
  const channelId = body.container.channel_id;
  const messageTs = body.container.message_ts;

  try {
    // Call the chat.update method to replace the message blocks
    await client.chat.update({
      channel: channelId,
      ts: messageTs,
      text: "Details were hidden.", // Fallback text
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Details have been hidden. 👍",
          },
        },
        // Note: The button is now gone because we didn't include it in the new blocks.
      ],
    });
  } catch (error) {
    console.error(error);
  }
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    app.logger.info("⚡️ Bolt app is running! ⚡️");
  } catch (error) {
    app.logger.error("Unable to start App", error);
  }
})();

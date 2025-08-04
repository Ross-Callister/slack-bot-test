import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";

const sampleMessageCallback = async ({ context, say, logger }: AllMiddlewareArgs & SlackEventMiddlewareArgs<"message">) => {
  try {
    const greeting = context.matches[0];

    // You can build your blocks array here
    await say({
      text: "Here are the project details.", // Fallback text
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Here is the *full report* on the Q3 project performance. It includes metrics on user engagement and revenue.",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Hide Details",
              },
              style: "danger", // Makes the button red
              action_id: "hide_details_button", // The unique ID for this action
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
};

export default sampleMessageCallback;

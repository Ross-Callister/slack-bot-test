import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { App } from "@slack/bolt";
import { LLMProvider } from "../../llm/llmProvider";
import { returnAccessRequest } from "./widgets/itAccessRequest";

const register = (app: App) => {
  app.message(async (event) => {
    // ignore message updates, only focus on new messages
    if (event.message.type !== "message" || event.message.subtype !== undefined) {
      return;
    }
    // Ignore messages sent by the bot itself to prevent infinite loops
    if (event.message.user === event.context.botUserId) {
      return;
    }
    // Check if the message is in a direct message channel
    if (event.message.channel_type !== "im") {
      return;
    }
    // You can handle the message here, e.g., send a response or log it
    const message = await app.client.chat.postMessage({
      channel: event.message.channel,
      text: "Thinking...",
    });
    const response = await LLMProvider.invokeLLM([
      new SystemMessage(
        "You are a helpful assistant. Keep responses short, such as in an instant-messaging conversation. Please respond to the following message in a helpful and informative manner:"
      ),
      new HumanMessage(event.message.text ?? "Hello!"),
    ]);
    void app.client.chat.delete({
      channel: event.message.channel,
      ts: message.ts!,
    });
    console.log("Response from LLM:", response);
    await app.client.chat.postMessage({
      channel: event.message.channel,
      text: response,
    });
    return;
  });
  // // Send a hardcoded IT access request message
  // app.message(async (event) => {
  //   // ignore message updates, only focus on new messages
  //   if (event.message.type !== "message" || event.message.subtype !== undefined) {
  //     return;
  //   }
  //   // Ignore messages sent by the bot itself to prevent infinite loops
  //   if (event.message.user === event.context.botUserId) {
  //     return;
  //   }
  //   await app.client.chat.postMessage({
  //     channel: event.message.channel,
  //     text: "> I've prepared the IT access request for you by confirming your role with our HR system. You can edit the fields below.",
  //     blocks: returnAccessRequest({
  //       message: "> I've prepared the IT access request for you by confirming your role with our HR system. You can edit the fields below.",
  //       possibleApplications: ["Salesforce", "Jira", "Confluence", "Google Drive"],
  //       selectedApplication: "Salesforce",
  //       possibleAccessLevels: ["Sales user", "Sales admin", "Sales manager"],
  //       requestedAccessLevel: "Sales user",
  //       justification: "New Account Executive",
  //     }),
  //   });
  //   return;
  // });
};

export default { register };

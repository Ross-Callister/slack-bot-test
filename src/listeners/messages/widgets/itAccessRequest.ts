import { ActionsBlockElement } from "@slack/types";
import { ChannelAndBlocks } from "@slack/web-api/dist/types/request/chat";

type Block = ChannelAndBlocks["blocks"][number];
type Blocks = ChannelAndBlocks["blocks"];

export interface AccessRequestProps {
  message: string;
  selectedApplication: string;
  possibleApplications: string[];
  requestedAccessLevel: string;
  possibleAccessLevels: string[];
  justification: string;
}

export function returnAccessRequest({
  message,
  selectedApplication,
  possibleApplications,
  requestedAccessLevel,
  possibleAccessLevels,
  justification,
}: AccessRequestProps): Blocks {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📄 IT access request ticket",
      },
    },
    {
      type: "divider",
    },
    getDropdown("Application", selectedApplication, possibleApplications),
    getDropdown("Access Level", requestedAccessLevel, possibleAccessLevels),
    getTextInput("Justification", justification),
    {
      type: "actions",
      elements: [
        {
          type: "overflow",
          options: [
            {
              text: {
                type: "plain_text",
                text: "Option One",
              },
              value: "option_1",
            },
            {
              text: {
                type: "plain_text",
                text: "Option Two",
              },
              value: "option_2",
            },
          ],
          action_id: "more_options_button",
        },
        getButton("Grant access", "grant_access_button"),
      ],
    },
  ];
}

function getDropdown(label: string, selected: string, options: string[]): Block {
  return {
    type: "input",
    block_id: label,
    element: {
      type: "static_select",
      action_id: "dropdown_action",
      initial_option: {
        text: {
          type: "plain_text",
          text: selected,
        },
        value: selected.toLowerCase(),
      },
      options: options.map((option) => ({
        text: {
          type: "plain_text",
          text: option,
        },
        value: option.toLowerCase(),
      })),
    },
    label: {
      type: "plain_text",
      text: label,
    },
  };
}

function getTextInput(label: string, initialValue: string): Block {
  return {
    type: "input",
    block_id: label,
    element: {
      type: "plain_text_input",
      action_id: "text_input_action",
      initial_value: initialValue,
    },
    label: {
      type: "plain_text",
      text: label,
    },
  };
}

function getButton(text: string, actionId: string): ActionsBlockElement {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text,
    },
    action_id: actionId,
  };
}

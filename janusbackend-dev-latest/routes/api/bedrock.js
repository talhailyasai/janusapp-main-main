import express from "express";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime"; // Import the correct client and command

const router = express.Router();

const bedrock = new BedrockAgentRuntimeClient({
  region: "eu-central-1",
});

router.post("/chat", async (req, res) => {
  const { message, language = "en" } = req.body;
  const sessionId = req.user?._id;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
      sessionId: sessionId,
      inputText: message,
    });

    const response = await bedrock.send(command);

    if (response && response.completion) {
      let completion = "";

      for await (const chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        if (chunk.bytes) {
          const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
          completion += decodedResponse;
        }
      }

      // console.log("Response from chatbot >>>>", completion);

      return res.status(200).json({
        response: completion,
      });
    } else {
      return res
        .status(500)
        .json({ error: "No completion received from the agent." });
    }
  } catch (error) {
    console.error("Bedrock Error Details:", {
      message: error.message,
      code: error.code,
      requestId: error.$metadata?.requestId,
    });

    // Send error response if something goes wrong
    return res.status(500).json({
      error: "Failed to process request",
      details: error.message,
    });
  }
});

export default router;

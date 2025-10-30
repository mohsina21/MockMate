import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth"; 

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
const deploymentName = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));


export async function askAzureText(prompt) {
  const response = await client.getChatCompletions(deploymentName, [
    { role: "user", content: prompt }
  ], {
    maxTokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || "No response from Azure.";
}

// 🖼️ Text + Image (GPT-4o)
export async function askAzureWithImage(prompt, base64Image) {
  const base64 = base64Image.split(',')[1]; 
  const response = await client.getChatCompletions(deploymentName, [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64}`
          }
        }
      ]
    }
  ]);

  return response.choices[0]?.message?.content?.trim() || "No image feedback from Azure.";
}

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const tenantDetails = (tenantGroup) => {
  let details = "";
  tenantGroup.tenantDetails.forEach((tenant, index) => {
    details += `Tenant ${index + 1}\n`;
    Object.keys(tenant).forEach((key) => {
      details += `- ${key} = ${tenant[key]}\n`;
    });
  });
  return details;
};

const generateAction = async (req, res) => {
  // Run first prompt

  const tenantGroup = req.body.tenantGroup;

  if (tenantGroup) {
    const pronoun = () => (tenantGroup.tenantDetails.length == 1 ? "I" : "we");
    const declarative = () =>
      tenantGroup.tenantDetails.length == 1 ? "I am" : "We are";
    const possessivePronoun = () =>
      tenantGroup.tenantDetails.length == 1 ? "my" : "our";

    const tenantPlural = () =>
      tenantDetails.length > 1 ? "good tenants" : "a good tenant";

    const prompt = `${declarative()} ${(tenantGroup.tenantRelationship = ""
      ? "an individual tenant."
      : tenantGroup.tenantRelationship)}. Write a letter that ${pronoun()} can attach to a house offer to convince the landlord that ${pronoun()} would be ${tenantPlural()}, and that they should choose ${possessivePronoun()} offer. The letter should be 500+ characters, written in British English, and be emotionally persuasive.`;

    const basePromptPrefix = prompt;

    console.log(`API: ${basePromptPrefix}\n\n${tenantDetails(tenantGroup)}`);

    const finalPrompt = `${basePromptPrefix}\n\n${tenantDetails(
      tenantGroup
    )}\n\nLetter:\n`;

    const baseCompletion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: finalPrompt,
      temperature: 0.7,
      max_tokens: 500,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput, prompt: finalPrompt });
  } else {
    console.log("error - no tenant details found");
    console.log(tenantGroup);
    res.status(500).json({ error: "no tenant details found " });
  }
};

export default generateAction;

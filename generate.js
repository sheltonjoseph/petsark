import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  const owner = req.body.owner || '';
  
  if (animal.trim().length === 0 || owner.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal and owner name",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal, owner),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal, owner) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  const capitalizedOwner =
    owner[0].toUpperCase() + owner.slice(1).toLowerCase();
  return `Suggest  ten names for an animal where the owner of the animal is ${owner}.
  Animal: Cat
  Names: Sheba ${owner}, Prince Purrington, Madame Meowington
  Animal: Dog
  Names: ${owner}ian Houndini, Princess ${owner}ia, Duke of ${owner}shire
  Animal: ${capitalizedAnimal}
  Names:`;
}

import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType, GradingResult } from '../types';
import { TOPICS } from '../topics';

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelName = 'gemini-2.5-flash';

const getPromptForType = (type: QuestionType): string => {
  switch (type) {
    case QuestionType.Cloze:
      return 'Generate a Cloze Test (文意選填). Create a single, cohesive article. Within the article, create 10 blanks, numbered (1) to (10). Then, provide 12 multiple-choice options labeled (A) through (L). Two of the options must be distractors.';
    case QuestionType.ParagraphStructure:
      return 'Generate a Paragraph Structure Test (篇章結構). Create a single, cohesive article with 4 main paragraphs. The article should have 4 blank slots where these paragraphs should go, numbered (1) to (4). Then, provide 5 paragraph options labeled (A) through (E). Four of these options are the correct paragraphs in a jumbled order, and one is an irrelevant distractor paragraph.';
    case QuestionType.ReadingComprehension:
      return 'Generate a Reading Comprehension Test (閱讀測驗). Create a single, cohesive article. Then, design 3 challenging, inference-based multiple-choice questions, clearly numbered 1., 2., 3., each with options (A), (B), (C), (D). The questions should require a deep understanding of the text\'s nuances, tone, and implied meaning, not just surface-level information.';
    case QuestionType.Mixed:
      return 'Generate a Mixed Format Test (混合題型). Create a single, cohesive article. Then, design a total of 5 challenging questions, clearly numbered 1. through 5. This set of questions must include at least one multiple-choice question and at least one non-multiple-choice question (e.g., fill-in-the-blank, short answer summarizing a key point).';
    default:
      throw new Error('Invalid question type');
  }
};

export const generateQuestion = async (type: QuestionType): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured. Please set the API_KEY environment variable.");
  }
  const typeSpecificPrompt = getPromptForType(type);
  const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const fullPrompt = `
You are an expert AI creating English proficiency tests for advanced high school students in Taiwan. Your sole task is to generate a difficult, high-quality test based on the following strict instructions.

*** TASK: ${typeSpecificPrompt} ***

*** TOPIC FOR THE ARTICLE: ${randomTopic} ***

*** CRITICAL RULES - ADHERE STRICTLY ***

1.  **VOCABULARY LEVEL**: The vocabulary used in the article and questions MUST primarily consist of words from Taiwan's High School Entrance Exam vocabulary list, Levels 1-3. You may include a few simple, common words from Level 4, but the core of the test should be based on Levels 1-3. You are FORBIDDEN from using any words from Level 5 or higher. This is the most important rule.

2.  **ARTICLE LENGTH**: The main English article must be at least 450 words long. It should be engaging, coherent, and on the specified topic.

3.  **DIFFICULTY**: The questions and options must be extremely challenging. Use plausible distractors, subtle traps, and options that require careful critical thinking. Avoid simple, obvious answers.

4.  **OUTPUT FORMAT (MANDATORY)**:
    - Your entire response MUST be plain text.
    - DO NOT use any Markdown (like **, ##, *, -) or HTML.
    - The output must contain the article, questions, and options first.
    - After all English content, you MUST use the exact Chinese separator on a new line: @@@答案與解析@@@
    - After the separator, provide the correct answers and a brief, clear analysis for each question in Traditional Chinese.

Generate the test now.
  `;

  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Error from API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};

export const gradeAnswers = async (question: string, answerKey: string, userAnswers: Record<string, string>): Promise<GradingResult> => {
    if (!API_KEY) {
      throw new Error("API_KEY is not configured. Cannot grade answers.");
    }
    const prompt = `You are an AI English test grader. Your task is to evaluate a student's answers based on the provided answer key.

    Here is the original test content:
    ---
    ${question}
    ---

    Here is the official answer key and analysis:
    ---
    ${answerKey}
    ---

    Here are the student's answers:
    ---
    ${JSON.stringify(userAnswers, null, 2)}
    ---

    Please perform the following actions:
    1. Compare the student's answers to the official answer key.
    2. Calculate a score out of 100. Be strict for multiple choice but allow for some variation in wording for short-answer questions, as long as the core meaning is correct. For cloze and paragraph structure, each correct item is worth an equal portion of 100 points.
    3. Provide brief, constructive, and encouraging feedback in Traditional Chinese. Focus on the incorrect answers and explain why they were wrong, referencing the analysis if helpful.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: "A score between 0 and 100."
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "Constructive feedback in Traditional Chinese."
                        }
                    },
                    required: ["score", "feedback"]
                },
            }
        });
        
        const result = JSON.parse(response.text);

        if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
            throw new Error("Parsed JSON does not match the expected format.");
        }
        return result;
    } catch (e) {
        console.error("Failed to parse grading response:", e);
        throw new Error("The AI grader returned an invalid response. Please try again.");
    }
};

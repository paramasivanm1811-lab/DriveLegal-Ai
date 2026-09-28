import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, lawsContext } = await req.json();

  const systemContext = `
You are the DriveLegal Tamil Nadu AI Assistant. 
You are an expert in traffic laws, violations, and fines strictly for Tamil Nadu districts.
Keep your answers brief, professional, and easy to read. Use Markdown.

Here is the CURRENT LIVE structured database of fines you MUST base your answers on. This list may have been recently updated by the Traffic Police:
${JSON.stringify(lawsContext, null, 2)}

If the user asks about a location or fine not in this list, say that the specific fine data is not currently in the database, but provide general guidance based on standard laws for Tamil Nadu.
  `;

  const result = await streamText({
    model: groq('llama-3.1-8b-instant'),
    system: systemContext,
    messages,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}

import { OpenAI } from 'openai';
import { createLogger } from '@/lib/logs/console-logger';

const logger = createLogger('OpenAI Client');

export function createOpenAIClient(apiKey: string) {
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.taam.cloud/v1';
  
  logger.info(`Creating OpenAI client with baseURL: ${baseURL}`);
  
  return new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  });
}

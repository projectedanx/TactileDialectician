export function parseAIError(err: any): string {
  console.error("AI Analysis Error:", err);
  
  if (!err) return 'An unknown error occurred.';

  const status = err.status || err.response?.status;
  const message = err.message || err.response?.data?.error?.message || '';

  if (message.includes('nerdamer') || message.includes('mathjs') || message.includes('parse error') || message.includes('simplification')) {
    return `Deterministic Parsing Error: ${message}. The symbolic engine could not evaluate the expression.`;
  }

  if (status === 429 || message.includes('429') || message.includes('quota') || message.includes('rate limit')) {
    return 'Rate limit exceeded or quota exhausted. Please wait a moment and try again.';
  }
  
  if (status === 401 || status === 403 || message.includes('API key') || message.includes('authentication')) {
    return 'Authentication failed. Please check your Gemini API key configuration.';
  }
  
  if (status === 500 || status === 503 || message.includes('503') || message.includes('overloaded')) {
    return 'The AI service is currently overloaded or unavailable. Please try again later.';
  }
  
  if (message.includes('JSON') || message.includes('parse')) {
    return 'The model returned an invalid response format. Please try again.';
  }
  
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Please check your internet connection.';
  }

  return `Analysis failed: ${message || 'Unexpected error'}`;
}

'use server';
/**
 * @fileOverview A tag suggestion AI agent.
 *
 * - suggestTags - A function that handles the tag suggestion process.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  noteContent: z.string().describe('The content of the note.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the note.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {
    schema: z.object({
      noteContent: z.string().describe('The content of the note.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(z.string()).describe('An array of suggested tags for the note.'),
    }),
  },
  prompt: `You are a tagging expert. Given the content of a note, suggest relevant tags. Only output the tags, comma separated.

Note Content: {{{noteContent}}}`,
});

const suggestTagsFlow = ai.defineFlow<
  typeof SuggestTagsInputSchema,
  typeof SuggestTagsOutputSchema
>(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Split the comma separated tags into an array.
    const tags = output!.tags;
    return {tags};
  }
);

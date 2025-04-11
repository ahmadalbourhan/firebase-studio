'use server';
/**
 * @fileOverview An AI agent that analyzes spending habits and provides personalized budgeting tips.
 *
 * - generateBudgetTips - A function that generates budgeting tips.
 * - GenerateBudgetTipsInput - The input type for the generateBudgetTips function.
 * - GenerateBudgetTipsOutput - The return type for the generateBudgetTips function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Budget, Expenses, checkBudget} from '@/services/budget-checker';

const GenerateBudgetTipsInputSchema = z.object({
  budget: z.object({
    categories: z.record(z.number()).describe('The amount budgeted for each category.'),
    totalBudget: z.number().describe('The total budget.'),
  }).describe('The user budget information.'),
  expenses: z.object({
    categories: z.record(z.number()).describe('The amount spent in each category.'),
    totalExpenses: z.number().describe('The total amount spent.'),
  }).describe('The user expense information.'),
  financialGoals: z.string().describe('The user financial goals.'),
});
export type GenerateBudgetTipsInput = z.infer<typeof GenerateBudgetTipsInputSchema>;

const GenerateBudgetTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('Personalized tips on how to optimize the budget based on financial goals.'),
});
export type GenerateBudgetTipsOutput = z.infer<typeof GenerateBudgetTipsOutputSchema>;

export async function generateBudgetTips(input: GenerateBudgetTipsInput): Promise<GenerateBudgetTipsOutput> {
  return generateBudgetTipsFlow(input);
}

const budgetAnalysisTool = ai.defineTool({
  name: 'checkBudget',
  description: 'Checks the user\'s budget and provides tips.',
  inputSchema: z.object({
    budget: z.object({
      categories: z.record(z.number()).describe('The amount budgeted for each category.'),
      totalBudget: z.number().describe('The total budget.'),
    }).describe('The user budget information.'),
    expenses: z.object({
      categories: z.record(z.number()).describe('The amount spent in each category.'),
      totalExpenses: z.number().describe('The total amount spent.'),
    }).describe('The user expense information.'),
  }),
  outputSchema: z.object({
    tips: z.array(z.string()).describe('Budgeting tips for the user.'),
  }),
  async fn(input: {budget: Budget, expenses: Expenses}) {
    return await checkBudget(input.budget, input.expenses);
  },
});

const prompt = ai.definePrompt({
  name: 'generateBudgetTipsPrompt',
  input: {
    schema: z.object({
      financialGoals: z.string().describe('The user financial goals.'),
    }),
  },
  output: {
    schema: z.object({
      tips: z.array(z.string()).describe('Personalized tips on how to optimize the budget based on financial goals.'),
    }),
  },
  tools: [budgetAnalysisTool],
  prompt: `You are a personal finance advisor. Analyze the user's spending habits and provide personalized tips on how to optimize their budget based on their financial goals.

  Financial Goals: {{{financialGoals}}}

  You can use the checkBudget tool to get some budget tips.
  `
});

const generateBudgetTipsFlow = ai.defineFlow<
  typeof GenerateBudgetTipsInputSchema,
  typeof GenerateBudgetTipsOutputSchema
>({
  name: 'generateBudgetTipsFlow',
  inputSchema: GenerateBudgetTipsInputSchema,
  outputSchema: GenerateBudgetTipsOutputSchema,
}, async input => {
  const {output} = await prompt({financialGoals: input.financialGoals});

  return {
    tips: [
      ...(output?.tips ?? [])
    ]
  };
});

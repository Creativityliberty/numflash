
export interface LLMModel {
    id: string;
    name: string;
    description: string;
    context: string;
    pricing: {
        input: string;
        output: string;
    };
    tags: string[];
    isNew?: boolean;
    isPaid?: boolean;
}

export const GEMINI_MODELS: LLMModel[] = [
    {
        id: 'gemini-3-pro-preview',
        name: 'Gemini 3 Pro Preview',
        description: 'Our most intelligent model with SOTA reasoning and multimodal understanding, and powerful agentic and vibe coding capabilities.',
        context: '<=200K tokens',
        pricing: { input: '$2,00', output: '$12,00' },
        tags: ['Reasoning', 'Multimodal', 'Coding'],
        isNew: true
    },
    {
        id: 'gemini-3-pro-image-preview',
        name: 'Gemini 3 Pro Image Preview',
        description: 'State-of-the-art image generation and editing model.',
        context: 'Text / Image',
        pricing: { input: '$2,00', output: '$12,00' },
        tags: ['Image Gen', 'Editing'],
        isNew: true,
        isPaid: true
    },
    {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3 Flash Preview',
        description: 'Our most intelligent model built for speed, combining frontier intelligence with superior search and grounding.',
        context: 'All context lengths',
        pricing: { input: '$0,50', output: '$3,00' },
        tags: ['Speed', 'Search'],
        isNew: true
    },
    {
        id: 'gemini-2.5-flash-image',
        name: 'Gemini 2.5 Flash Image',
        description: 'Our state-of-the-art image generation and editing model.',
        context: 'Text / Image',
        pricing: { input: '$0,30', output: '$2,50' },
        tags: ['Image Gen']
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Our previous generation advanced reasoning model, which excels at coding and complex reasoning tasks.',
        context: '<=200K tokens',
        pricing: { input: '$1,25', output: '$10,00' },
        tags: ['Coding', 'Reasoning']
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Our hybrid reasoning model, with a 1M token context window and thinking budgets.',
        context: 'All context lengths',
        pricing: { input: '$0,30', output: '$2,50' },
        tags: ['Hybrid', '1M Context']
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Our second generation multimodal model with great performance across all tasks.',
        context: 'All context lengths',
        pricing: { input: '$0,10', output: '$0,40' },
        tags: ['Multimodal']
    }
];

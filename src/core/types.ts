export type ChatMsg = { 
    role: 'user' | 'assistant' | 'system' | 'tool'; 
    content: string; 
    name?: string 
};

export type ToolCall = { 
    name: string; 
    arguments: Record<string, unknown> 
};

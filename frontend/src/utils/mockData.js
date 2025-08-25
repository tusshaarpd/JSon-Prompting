export const mockConversions = [
  {
    id: 1,
    textPrompt: "Summarize this research paper in 5 bullet points",
    jsonOutput: {
      action: "summarize",
      input: {
        type: "research paper",
        source: "document"
      },
      output: {
        format: "bullet_points",
        count: 5,
        style: "concise"
      },
      constraints: {
        length: "brief",
        focus: "key_findings"
      }
    }
  },
  {
    id: 2,
    textPrompt: "Generate a creative story about a robot learning to paint",
    jsonOutput: {
      action: "generate",
      input: {
        type: "creative_writing",
        genre: "story"
      },
      output: {
        format: "narrative",
        theme: "learning_journey",
        characters: ["robot"],
        activity: "painting"
      },
      style: {
        tone: "creative",
        length: "medium"
      }
    }
  },
  {
    id: 3,
    textPrompt: "Analyze customer feedback and extract key insights",
    jsonOutput: {
      action: "analyze",
      input: {
        type: "customer_feedback",
        source: "reviews_surveys"
      },
      output: {
        format: "insights",
        categories: ["sentiment", "themes", "recommendations"],
        priority: "key_findings"
      },
      processing: {
        method: "text_analysis",
        focus: "actionable_insights"
      }
    }
  },
  {
    id: 4,
    textPrompt: "Create a social media post for a new product launch",
    jsonOutput: {
      action: "create",
      input: {
        type: "marketing_content",
        context: "product_launch"
      },
      output: {
        format: "social_media_post",
        platform: "multi_platform",
        elements: ["headline", "description", "hashtags", "call_to_action"]
      },
      style: {
        tone: "engaging",
        length: "short",
        audience: "target_customers"
      },
      constraints: {
        character_limit: "platform_specific",
        include_branding: true
      }
    }
  },
  {
    id: 5,
    textPrompt: "Translate this document from English to Spanish",
    jsonOutput: {
      action: "translate",
      input: {
        type: "document",
        source_language: "english"
      },
      output: {
        format: "translated_text",
        target_language: "spanish",
        preserve_formatting: true
      },
      quality: {
        accuracy: "high",
        cultural_adaptation: true
      }
    }
  },
  {
    id: 6,
    textPrompt: "Write a professional email response to a client complaint",
    jsonOutput: {
      action: "write",
      input: {
        type: "email",
        context: "client_complaint"
      },
      output: {
        format: "professional_email",
        components: ["acknowledgment", "solution", "follow_up"],
        tone: "empathetic_professional"
      },
      constraints: {
        length: "concise",
        maintain_relationship: true,
        provide_resolution: true
      }
    }
  }
];

export const modelOptions = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable model for complex reasoning and creative tasks',
    capabilities: ['reasoning', 'creativity', 'analysis']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient for most conversational tasks',
    capabilities: ['conversation', 'summarization', 'Q&A']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Excellent for analysis, research, and complex reasoning',
    capabilities: ['analysis', 'research', 'reasoning']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced model for various tasks with good performance',
    capabilities: ['general', 'balanced', 'efficient']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s advanced model for multimodal understanding',
    capabilities: ['multimodal', 'reasoning', 'code']
  }
];

// Example JSON schemas for different prompt types
export const exampleSchemas = {
  summarization: {
    action: "summarize",
    input: { type: "text", source: "document" },
    output: { format: "bullet_points", count: 5 },
    constraints: { length: "brief" }
  },
  generation: {
    action: "generate",
    input: { type: "creative_writing" },
    output: { format: "narrative", length: "medium" },
    style: { tone: "creative" }
  },
  analysis: {
    action: "analyze",
    input: { type: "data", source: "dataset" },
    output: { format: "insights", categories: ["trends", "patterns"] },
    processing: { method: "statistical_analysis" }
  }
};
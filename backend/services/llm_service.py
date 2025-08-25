import os
import json
import time
from typing import Dict, Any, Tuple
from emergentintegrations.llm.chat import LlmChat, UserMessage
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.emergent_key = os.environ.get('EMERGENT_LLM_KEY')
        self.model_configs = {
            # OpenAI Models
            "gpt-4": {"provider": "openai", "model": "gpt-4"},
            "gpt-4o": {"provider": "openai", "model": "gpt-4o"},
            "gpt-4o-mini": {"provider": "openai", "model": "gpt-4o-mini"},
            "gpt-3.5-turbo": {"provider": "openai", "model": "gpt-3.5-turbo"},
            
            # Anthropic Models
            "claude-3-opus": {"provider": "anthropic", "model": "claude-3-5-sonnet-20241022"},
            "claude-3-sonnet": {"provider": "anthropic", "model": "claude-3-5-sonnet-20241022"},
            "claude-3-haiku": {"provider": "anthropic", "model": "claude-3-5-haiku-20241022"},
            
            # Google Models
            "gemini-pro": {"provider": "gemini", "model": "gemini-2.0-flash"},
            "gemini-flash": {"provider": "gemini", "model": "gemini-2.0-flash"}
        }
    
    def get_available_models(self) -> list[Dict[str, Any]]:
        """Get list of available models with metadata"""
        models = [
            {
                "id": "gpt-4o-mini",
                "name": "GPT-4o Mini",
                "provider": "OpenAI",
                "description": "Fast and efficient model for most tasks",
                "capabilities": ["reasoning", "analysis", "creativity"]
            },
            {
                "id": "gpt-4",
                "name": "GPT-4",
                "provider": "OpenAI", 
                "description": "Most capable model for complex reasoning",
                "capabilities": ["advanced_reasoning", "creativity", "analysis"]
            },
            {
                "id": "claude-3-sonnet",
                "name": "Claude 3 Sonnet",
                "provider": "Anthropic",
                "description": "Excellent for analysis and structured thinking",
                "capabilities": ["analysis", "research", "reasoning"]
            },
            {
                "id": "gemini-pro",
                "name": "Gemini Pro",
                "provider": "Google",
                "description": "Google's advanced model with multimodal capabilities", 
                "capabilities": ["multimodal", "reasoning", "code"]
            }
        ]
        return models
    
    async def convert_prompt_to_json(self, text_prompt: str, model_id: str = "gpt-4o-mini", api_key: str = None) -> Tuple[Dict[str, Any], float]:
        """Convert a text prompt to structured JSON using LLM"""
        start_time = time.time()
        
        try:
            # Use provided API key or fallback to Emergent key
            effective_key = api_key if api_key else self.emergent_key
            
            if not effective_key:
                raise ValueError("No API key available")
            
            # Get model configuration
            model_config = self.model_configs.get(model_id, self.model_configs["gpt-4o-mini"])
            
            # Create system message for JSON conversion
            system_message = """You are an expert at converting natural language prompts into structured JSON schemas. 

Your task is to analyze the input prompt and create a well-structured JSON object that captures:
1. The main action/intent
2. Input requirements and types
3. Output specifications
4. Any constraints or parameters
5. Processing requirements

Use consistent, clear keys and provide a clean, parseable JSON structure. Do not include any additional text or explanations - only return the JSON object.

Example format:
{
  "action": "action_type",
  "input": {
    "type": "input_type",
    "source": "source_info"
  },
  "output": {
    "format": "output_format",
    "structure": "structure_details"
  },
  "constraints": {
    "length": "constraint_info",
    "style": "style_requirements"
  }
}"""
            
            # Initialize chat with session
            session_id = f"conversion_{int(time.time())}"
            chat = LlmChat(
                api_key=effective_key,
                session_id=session_id,
                system_message=system_message
            )
            
            # Configure model
            chat.with_model(model_config["provider"], model_config["model"])
            
            # Create user message
            user_message = UserMessage(
                text=f"Convert this prompt to structured JSON: {text_prompt}"
            )
            
            # Send message and get response
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            try:
                # Clean response and parse JSON
                json_str = response.strip()
                if json_str.startswith('```json'):
                    json_str = json_str.replace('```json', '').replace('```', '').strip()
                elif json_str.startswith('```'):
                    json_str = json_str.replace('```', '').strip()
                
                json_output = json.loads(json_str)
                
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON, creating fallback structure: {e}")
                # Create a fallback JSON structure
                json_output = {
                    "action": "process",
                    "input": {
                        "type": "text",
                        "content": text_prompt
                    },
                    "output": {
                        "format": "structured_response",
                        "description": "AI-generated response"
                    },
                    "raw_llm_response": response
                }
            
            processing_time = time.time() - start_time
            
            return json_output, processing_time
            
        except Exception as e:
            logger.error(f"Error in LLM conversion: {str(e)}")
            processing_time = time.time() - start_time
            
            # Return error structure
            error_json = {
                "error": "conversion_failed",
                "message": str(e),
                "input": text_prompt,
                "fallback": {
                    "action": "error_handling",
                    "input": {"type": "text", "content": text_prompt},
                    "output": {"format": "error_response"},
                    "constraints": {"error_type": "llm_service_error"}
                }
            }
            
            return error_json, processing_time
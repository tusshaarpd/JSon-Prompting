# API Contracts & Integration Plan

## Overview
Convert text prompts to structured JSON using LLM integration with Emergent LLM Key.

## Mock Data to Replace
**Location**: `/app/frontend/src/utils/mockData.js`
- `mockConversions` array - Replace with real API calls
- Example prompts and their JSON outputs currently hardcoded

## API Endpoints

### 1. POST /api/convert-prompt
**Purpose**: Convert text prompt to structured JSON

**Request Body**:
```json
{
  "textPrompt": "string (required)",
  "model": "string (optional, default: gpt-4)",
  "apiKey": "string (optional - user's own key)",
  "useEmergentKey": "boolean (default: true)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "originalPrompt": "string",
    "jsonOutput": {...},
    "model": "string",
    "processingTime": "number"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

### 2. GET /api/models
**Purpose**: Get available LLM models

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "description": "string"
    }
  ]
}
```

## Frontend Integration Changes

### Files to Update:
1. **`/app/frontend/src/components/PromptConverter.jsx`**
   - Replace `mockConversions` import with API call
   - Update `handleConvert()` function to call `/api/convert-prompt`
   - Add proper error handling
   - Remove mock timeout simulation

2. **`/app/frontend/src/utils/mockData.js`**
   - Keep for fallback/demo purposes
   - Move to separate demo file

## Backend Implementation Plan

### Dependencies Required:
- Emergent Integrations library for LLM access
- Request validation with Pydantic models
- Error handling middleware
- Rate limiting (future enhancement)

### Core Logic:
1. **Prompt Analysis**: Parse input text to identify intent, entities, parameters
2. **JSON Schema Generation**: Create structured output with consistent keys
3. **Model Selection**: Handle different LLM model capabilities
4. **Response Formatting**: Standardize JSON structure across all models

### Key Features:
- Support multiple LLM models (OpenAI, Anthropic, Google)
- Graceful error handling for API failures
- Input validation and sanitization
- Response caching (future enhancement)

## Integration Steps:
1. Install Emergent Integrations library
2. Set up LLM client with Emergent LLM Key
3. Create prompt conversion service
4. Implement API endpoints
5. Update frontend to use real endpoints
6. Test end-to-end functionality
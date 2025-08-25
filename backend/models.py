from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class ConvertPromptRequest(BaseModel):
    textPrompt: str = Field(..., description="The text prompt to convert to JSON")
    model: Optional[str] = Field(default="gpt-4o-mini", description="LLM model to use")
    apiKey: Optional[str] = Field(default=None, description="User's own API key")
    useEmergentKey: Optional[bool] = Field(default=True, description="Use Emergent LLM Key")

class ConvertPromptResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None

class ConversionData(BaseModel):
    originalPrompt: str
    jsonOutput: Dict[str, Any]
    model: str
    processingTime: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    capabilities: list[str]

class ModelsResponse(BaseModel):
    success: bool
    data: list[ModelInfo]

# Database model for storing conversions
class ConversionRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    originalPrompt: str
    jsonOutput: Dict[str, Any]
    model: str
    processingTime: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    userSession: Optional[str] = None
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import time

# Import models and services
from models import (
    ConvertPromptRequest, 
    ConvertPromptResponse, 
    ConversionData,
    ModelsResponse,
    ModelInfo,
    ConversionRecord
)
from services.llm_service import LLMService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize LLM service
llm_service = LLMService()

# Create the main app without a prefix
app = FastAPI(title="Emergent Prompt Converter API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Emergent Prompt Converter API", "version": "1.0.0"}

@api_router.get("/models", response_model=ModelsResponse)
async def get_models():
    """Get available LLM models"""
    try:
        models_data = llm_service.get_available_models()
        models = [ModelInfo(**model) for model in models_data]
        return ModelsResponse(success=True, data=models)
    except Exception as e:
        logging.error(f"Error getting models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch models")

@api_router.post("/convert-prompt", response_model=ConvertPromptResponse)
async def convert_prompt(request: ConvertPromptRequest):
    """Convert text prompt to structured JSON"""
    try:
        start_time = time.time()
        
        # Validate input
        if not request.textPrompt or not request.textPrompt.strip():
            raise HTTPException(status_code=400, detail="Text prompt is required")
        
        # Determine API key to use
        api_key = None
        if not request.useEmergentKey and request.apiKey:
            api_key = request.apiKey
        elif request.useEmergentKey:
            api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        if not api_key:
            raise HTTPException(status_code=400, detail="No API key available")
        
        # Convert prompt using LLM service
        json_output, processing_time = await llm_service.convert_prompt_to_json(
            text_prompt=request.textPrompt,
            model_id=request.model,
            api_key=api_key
        )
        
        # Create response data
        conversion_data = ConversionData(
            originalPrompt=request.textPrompt,
            jsonOutput=json_output,
            model=request.model,
            processingTime=processing_time
        )
        
        # Save to database
        try:
            record = ConversionRecord(
                originalPrompt=request.textPrompt,
                jsonOutput=json_output,
                model=request.model,
                processingTime=processing_time
            )
            await db.prompt_conversions.insert_one(record.dict())
        except Exception as db_error:
            logging.warning(f"Failed to save to database: {str(db_error)}")
            # Continue without failing the request
        
        return ConvertPromptResponse(
            success=True,
            data=conversion_data.dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error converting prompt: {str(e)}")
        return ConvertPromptResponse(
            success=False,
            error={
                "message": str(e),
                "code": "conversion_error"
            }
        )

@api_router.get("/conversions")
async def get_conversion_history(limit: int = 10):
    """Get recent conversion history"""
    try:
        conversions = await db.prompt_conversions.find().sort("timestamp", -1).limit(limit).to_list(limit)
        return {
            "success": True,
            "data": conversions
        }
    except Exception as e:
        logging.error(f"Error getting conversions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversion history")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
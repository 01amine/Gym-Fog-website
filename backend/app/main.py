from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from app.config import settings
from pymongo import AsyncMongoClient
from beanie import init_beanie
from app.models.user import User
from app.api.user import router as user_router
from app.api.categories import router as categories_router
from app.api.products import router as products_router
from app.api.order import router as order_router
from app.api.dashboard import router as dashboard_router
from app.minio import init_minio_client
from app.models.products import Product
from app.models.category import Category
from app.models.order import Order
from fastapi.middleware.cors import CORSMiddleware


mongo_client = AsyncMongoClient(settings.MONGO_URI)
mongo_db = mongo_client[settings.MONGO_DB]


async def init_mongo():
    await init_beanie(database=mongo_db, document_models=[User, Product, Category, Order])
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_mongo()
    await init_minio_client(
        minio_host=settings.MINIO_HOST,
        minio_port=settings.MINIO_PORT,
        minio_root_user=settings.MINIO_ROOT_USER,
        minio_root_password=settings.MINIO_ROOT_PASSWORD
        
  
    )
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[*settings.allowed_origins_list], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(user_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(order_router)
app.include_router(dashboard_router)


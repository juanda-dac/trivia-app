from pydantic_settings import BaseSettings, SettingsConfigDict

class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    gemini_api_key: str
    mongo_user: str
    mongo_password: str
    mongo_db: str


settings = Config()
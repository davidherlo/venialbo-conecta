from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "VenialboConecta API"
    database_url: str = "sqlite:///./puebloapp.db"
    secret_key: str = "cambia-esta-clave-en-produccion"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 horas
    images_dir: str = "media/imagenes"

    class Config:
        env_file = ".env"


settings = Settings()

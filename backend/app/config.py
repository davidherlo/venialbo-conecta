from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "VenialboConecta API"
    database_url: str = "sqlite:///./puebloapp.db"
    secret_key: str = "cambia-esta-clave-en-produccion"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 horas
    images_dir: str = "media/imagenes"
    google_client_id: str = ""  # Rellenar en .env con el Client ID de Firebase
    dev_mode: bool = True  # PONER A False ANTES DE PRODUCCIÓN — habilita /auth/dev-login sin Google
    firebase_service_account: str = "firebase-service-account.json"  # Clave de servicio Firebase Admin SDK
    cors_origins: list[str] = [
        "http://localhost:5173",  # Vite dev server (frontend web)
        "http://localhost:3000",  # alternativa si se cambia el puerto
    ]

    class Config:
        env_file = ".env"


settings = Settings()

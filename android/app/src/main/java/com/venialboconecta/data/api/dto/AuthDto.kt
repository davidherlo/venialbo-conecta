package com.venialboconecta.data.api.dto

data class GoogleLoginRequest(
    val id_token: String,
)

data class TokenResponse(
    val access_token: String,
    val token_type: String,
    val rol: String,
    val nombre: String,
    val email: String,
)

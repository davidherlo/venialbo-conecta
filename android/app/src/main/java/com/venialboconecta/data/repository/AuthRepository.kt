package com.venialboconecta.data.repository

import com.venialboconecta.VenialboConectaApp
import com.venialboconecta.data.api.RetrofitClient
import com.venialboconecta.data.api.dto.DevLoginRequest
import com.venialboconecta.data.api.dto.GoogleLoginRequest

class AuthRepository {

    private val api = RetrofitClient.api
    private val session = VenialboConectaApp.sessionManager

    suspend fun loginConGoogle(idToken: String): Result<Unit> {
        return try {
            val response = api.loginGoogle(GoogleLoginRequest(id_token = idToken))
            session.token = response.access_token
            session.rol = response.rol
            session.nombre = response.nombre
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginDev(email: String, nombre: String, rol: String): Result<Unit> {
        return try {
            val response = api.loginDev(DevLoginRequest(email = email, nombre = nombre, rol = rol))
            session.token = response.access_token
            session.rol = response.rol
            session.nombre = response.nombre
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

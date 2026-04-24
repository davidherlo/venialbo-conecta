package com.venialboconecta.data.repository

import com.venialboconecta.data.api.RetrofitClient
import com.venialboconecta.data.api.VenialboApiService
import com.venialboconecta.data.api.dto.AnuncioCreateRequest
import com.venialboconecta.data.api.dto.AnuncioDto

class AnuncioRepository(
    private val api: VenialboApiService = RetrofitClient.api,
) {
    suspend fun getAnuncios(tipo: String? = null): List<AnuncioDto> =
        api.getAnuncios(tipo)

    suspend fun getAnuncio(id: Int): AnuncioDto =
        api.getAnuncio(id)

    suspend fun crearAnuncio(tipo: String, titulo: String, descripcion: String?, contacto: String?): AnuncioDto =
        api.crearAnuncio(
            AnuncioCreateRequest(
                tipo = tipo,
                titulo = titulo,
                descripcion = descripcion?.takeIf { it.isNotBlank() },
                contacto = contacto?.takeIf { it.isNotBlank() },
            )
        )
}

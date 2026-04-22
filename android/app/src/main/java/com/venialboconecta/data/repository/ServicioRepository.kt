package com.venialboconecta.data.repository

import com.venialboconecta.data.api.RetrofitClient
import com.venialboconecta.data.api.VenialboApiService
import com.venialboconecta.data.api.dto.ServicioDto

class ServicioRepository(
    private val api: VenialboApiService = RetrofitClient.api,
) {
    suspend fun getServicios(tipo: String? = null): List<ServicioDto> =
        api.getServicios(tipo)

    suspend fun getServicio(id: Int): ServicioDto =
        api.getServicio(id)
}

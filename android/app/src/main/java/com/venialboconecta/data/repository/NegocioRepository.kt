package com.venialboconecta.data.repository

import com.venialboconecta.data.api.RetrofitClient
import com.venialboconecta.data.api.VenialboApiService
import com.venialboconecta.data.api.dto.NegocioDto

class NegocioRepository(
    private val api: VenialboApiService = RetrofitClient.api,
) {
    suspend fun getNegocios(categoria: String? = null): List<NegocioDto> =
        api.getNegocios(categoria)

    suspend fun getCategorias(): List<String> =
        api.getCategoríasNegocio()

    suspend fun getNegocio(id: Int): NegocioDto =
        api.getNegocio(id)
}

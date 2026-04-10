package com.venialboconecta.data.api

import com.venialboconecta.data.api.dto.CategoriaDto
import com.venialboconecta.data.api.dto.NoticiaDetalleDto
import com.venialboconecta.data.api.dto.NoticiaListDto
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface VenialboApiService {

    @GET("categorias/")
    suspend fun getCategorias(): List<CategoriaDto>

    @GET("noticias/")
    suspend fun getNoticias(
        @Query("categoria_id") categoriaId: Int? = null,
        @Query("destacadas") destacadas: Boolean? = null,
        @Query("busqueda") busqueda: String? = null,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 20,
    ): List<NoticiaListDto>

    @GET("noticias/{id}")
    suspend fun getNoticia(@Path("id") id: Int): NoticiaDetalleDto
}

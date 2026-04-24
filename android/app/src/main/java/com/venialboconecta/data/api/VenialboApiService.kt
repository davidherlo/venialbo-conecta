package com.venialboconecta.data.api

import com.venialboconecta.data.api.dto.AnuncioCreateRequest
import com.venialboconecta.data.api.dto.AnuncioDto
import com.venialboconecta.data.api.dto.DevLoginRequest
import com.venialboconecta.data.api.dto.GoogleLoginRequest
import com.venialboconecta.data.api.dto.NegocioDto
import com.venialboconecta.data.api.dto.ServicioDto
import com.venialboconecta.data.api.dto.TokenResponse
import com.venialboconecta.data.api.dto.CategoriaDto
import com.venialboconecta.data.api.dto.NoticiaDetalleDto
import com.venialboconecta.data.api.dto.NoticiaListDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface VenialboApiService {

    @POST("auth/google")
    suspend fun loginGoogle(@Body body: GoogleLoginRequest): TokenResponse

    @POST("auth/dev-login")
    suspend fun loginDev(@Body body: DevLoginRequest): TokenResponse

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

    @GET("negocios/")
    suspend fun getNegocios(@Query("categoria") categoria: String? = null): List<NegocioDto>

    @GET("negocios/categorias")
    suspend fun getCategoríasNegocio(): List<String>

    @GET("negocios/{id}")
    suspend fun getNegocio(@Path("id") id: Int): NegocioDto

    @GET("servicios/")
    suspend fun getServicios(@Query("tipo") tipo: String? = null): List<ServicioDto>

    @GET("servicios/{id}")
    suspend fun getServicio(@Path("id") id: Int): ServicioDto

    @GET("anuncios/")
    suspend fun getAnuncios(@Query("tipo") tipo: String? = null): List<AnuncioDto>

    @GET("anuncios/{id}")
    suspend fun getAnuncio(@Path("id") id: Int): AnuncioDto

    @POST("anuncios/")
    suspend fun crearAnuncio(@Body body: AnuncioCreateRequest): AnuncioDto
}

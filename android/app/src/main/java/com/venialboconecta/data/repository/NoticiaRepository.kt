package com.venialboconecta.data.repository

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.venialboconecta.data.api.RetrofitClient
import com.venialboconecta.data.api.VenialboApiService
import com.venialboconecta.data.api.dto.CategoriaDto
import com.venialboconecta.data.api.dto.NoticiaDetalleDto
import com.venialboconecta.data.api.dto.NoticiaListDto
import java.io.File

class NoticiaRepository(
    private val api: VenialboApiService = RetrofitClient.api,
    private val context: Context? = null,
) {
    private val gson = Gson()

    suspend fun getCategorias(): List<CategoriaDto> {
        return try {
            val data = api.getCategorias()
            guardarCache("categorias", gson.toJson(data))
            data
        } catch (e: Exception) {
            leerCache<List<CategoriaDto>>("categorias") ?: throw e
        }
    }

    suspend fun getNoticias(
        categoriaId: Int? = null,
        busqueda: String? = null,
        skip: Int = 0,
        limit: Int = 20,
    ): List<NoticiaListDto> {
        return try {
            val data = api.getNoticias(
                categoriaId = categoriaId,
                busqueda = busqueda,
                skip = skip,
                limit = limit,
            )
            // Solo cachear la primera página sin filtros
            if (skip == 0 && categoriaId == null && busqueda == null) {
                guardarCache("noticias", gson.toJson(data))
            }
            data
        } catch (e: Exception) {
            if (skip == 0 && categoriaId == null && busqueda == null) {
                leerCache<List<NoticiaListDto>>("noticias") ?: throw e
            } else {
                throw e
            }
        }
    }

    suspend fun getNoticia(id: Int): NoticiaDetalleDto = api.getNoticia(id)

    private fun guardarCache(nombre: String, json: String) {
        val dir = context?.cacheDir ?: return
        File(dir, "cache_$nombre.json").writeText(json)
    }

    private inline fun <reified T> leerCache(nombre: String): T? {
        val dir = context?.cacheDir ?: return null
        val file = File(dir, "cache_$nombre.json")
        if (!file.exists()) return null
        return try {
            gson.fromJson(file.readText(), object : TypeToken<T>() {}.type)
        } catch (_: Exception) {
            null
        }
    }
}

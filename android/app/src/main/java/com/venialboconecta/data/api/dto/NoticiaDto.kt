package com.venialboconecta.data.api.dto

import com.google.gson.annotations.SerializedName

/** Versión compacta del listado (coincide con NoticiaListOut del backend). */
data class NoticiaListDto(
    val id: Int,
    val titulo: String,
    @SerializedName("imagen_url") val imagenUrl: String?,
    val categoria: CategoriaDto,
    @SerializedName("fecha_publicacion") val fechaPublicacion: String,
    val destacada: Boolean,
    val activa: Boolean,
)

/** Detalle completo de una noticia (coincide con NoticiaOut del backend). */
data class NoticiaDetalleDto(
    val id: Int,
    val titulo: String,
    val contenido: String,
    @SerializedName("imagen_url") val imagenUrl: String?,
    @SerializedName("categoria_id") val categoriaId: Int,
    @SerializedName("autor_id") val autorId: Int,
    @SerializedName("fecha_publicacion") val fechaPublicacion: String,
    val destacada: Boolean,
    val activa: Boolean,
    val categoria: CategoriaDto,
)

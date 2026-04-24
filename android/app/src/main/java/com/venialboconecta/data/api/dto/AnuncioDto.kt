package com.venialboconecta.data.api.dto

import com.google.gson.annotations.SerializedName

data class AnuncioDto(
    val id: Int,
    val tipo: String,
    val titulo: String,
    val descripcion: String?,
    val contacto: String?,
    @SerializedName("imagen_url") val imagenUrl: String?,
    @SerializedName("autor_id") val autorId: Int,
    @SerializedName("fecha_publicacion") val fechaPublicacion: String,
    val activo: Boolean,
    @SerializedName("fecha_caducidad") val fechaCaducidad: String,
)

data class AnuncioCreateRequest(
    val tipo: String,
    val titulo: String,
    val descripcion: String?,
    val contacto: String?,
)

package com.venialboconecta.data.api.dto

import com.google.gson.annotations.SerializedName

data class NegocioDto(
    val id: Int,
    val nombre: String,
    val descripcion: String?,
    val direccion: String?,
    val telefono: String?,
    val email: String?,
    @SerializedName("web_url") val webUrl: String?,
    @SerializedName("redes_sociales") val redesSociales: Map<String, String>?,
    @SerializedName("logo_url") val logoUrl: String?,
    val horario: String?,
    @SerializedName("categoria_negocio") val categoriaNegocio: String?,
    val activo: Boolean,
)

package com.venialboconecta.data.api.dto

import com.google.gson.annotations.SerializedName

data class ServicioDto(
    val id: Int,
    val nombre: String,
    val tipo: String,
    val descripcion: String?,
    val direccion: String?,
    val telefono: String?,
    val horario: String?,
    @SerializedName("informacion_adicional") val informacionAdicional: String?,
    val activo: Boolean,
)

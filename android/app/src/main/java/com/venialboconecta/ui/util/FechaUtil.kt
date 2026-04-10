package com.venialboconecta.ui.util

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

private val inputFormat = DateTimeFormatter.ISO_LOCAL_DATE_TIME
private val outputFormat = DateTimeFormatter.ofPattern("d 'de' MMMM yyyy", Locale.of("es", "ES"))

fun formatearFecha(fechaIso: String): String {
    return try {
        val date = LocalDateTime.parse(fechaIso.take(19), inputFormat)
        date.format(outputFormat)
    } catch (_: Exception) {
        fechaIso.take(10)
    }
}

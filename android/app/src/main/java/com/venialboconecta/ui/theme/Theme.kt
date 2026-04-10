package com.venialboconecta.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColors = lightColorScheme(
    primary = Verde,
    onPrimary = Blanco,
    primaryContainer = VerdeClaro,
    secondary = Naranja,
    background = GrisFondo,
    surface = Blanco,
    onBackground = TextoPrincipal,
    onSurface = TextoPrincipal,
    onSurfaceVariant = TextoSecundario,
)

@Composable
fun VenialboConectaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColors,
        typography = AppTypography,
        content = content,
    )
}

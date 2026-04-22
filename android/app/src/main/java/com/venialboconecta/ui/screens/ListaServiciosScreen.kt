package com.venialboconecta.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.venialboconecta.data.api.dto.ServicioDto
import com.venialboconecta.ui.components.CategoriaChip
import com.venialboconecta.viewmodel.ListaServiciosViewModel
import com.venialboconecta.viewmodel.TIPOS_SERVICIO

@Composable
fun ListaServiciosScreen(
    onServicioClick: (Int) -> Unit,
    viewModel: ListaServiciosViewModel = viewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        when {
            state.cargando && state.servicios.isEmpty() -> {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }

            state.error != null && state.servicios.isEmpty() -> {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                    TextButton(onClick = { viewModel.cargarDatos() }) { Text("Reintentar") }
                }
            }

            else -> {
                Column {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        item {
                            CategoriaChip(
                                nombre = "Todos",
                                seleccionada = state.tipoSeleccionado == null,
                                onClick = { viewModel.filtrarPorTipo(null) },
                            )
                        }
                        items(TIPOS_SERVICIO) { (clave, etiqueta) ->
                            CategoriaChip(
                                nombre = etiqueta,
                                seleccionada = state.tipoSeleccionado == clave,
                                onClick = { viewModel.filtrarPorTipo(clave) },
                            )
                        }
                    }

                    if (state.servicios.isEmpty() && !state.cargando) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                "No hay servicios registrados",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(12.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                        ) {
                            items(state.servicios, key = { it.id }) { servicio ->
                                ServicioCard(
                                    servicio = servicio,
                                    onClick = { onServicioClick(servicio.id) },
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ServicioCard(servicio: ServicioDto, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                iconoParaTipo(servicio.tipo),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(40.dp),
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = servicio.nombre,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = etiquetaParaTipo(servicio.tipo),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
                if (servicio.horario != null) {
                    Text(
                        text = servicio.horario,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
    }
}

private fun iconoParaTipo(tipo: String): ImageVector = when (tipo) {
    "medico" -> Icons.Filled.LocalHospital
    "comedor" -> Icons.Filled.Restaurant
    "bibliobus" -> Icons.Filled.MenuBook
    "venta_ambulante" -> Icons.Filled.ShoppingCart
    else -> Icons.Filled.MoreHoriz
}

private fun etiquetaParaTipo(tipo: String): String =
    TIPOS_SERVICIO.firstOrNull { it.first == tipo }?.second ?: tipo

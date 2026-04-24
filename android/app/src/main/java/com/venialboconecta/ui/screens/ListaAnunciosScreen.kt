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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Announcement
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.venialboconecta.data.api.dto.AnuncioDto
import com.venialboconecta.ui.components.CategoriaChip
import com.venialboconecta.ui.util.formatearFecha
import com.venialboconecta.viewmodel.ListaAnunciosViewModel
import com.venialboconecta.viewmodel.TIPOS_ANUNCIO

@Composable
fun ListaAnunciosScreen(
    onAnuncioClick: (Int) -> Unit,
    viewModel: ListaAnunciosViewModel = viewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        when {
            state.cargando && state.anuncios.isEmpty() -> {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }

            state.error != null && state.anuncios.isEmpty() -> {
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
                        items(TIPOS_ANUNCIO) { (clave, etiqueta) ->
                            CategoriaChip(
                                nombre = etiqueta,
                                seleccionada = state.tipoSeleccionado == clave,
                                onClick = { viewModel.filtrarPorTipo(clave) },
                            )
                        }
                    }

                    if (state.anuncios.isEmpty() && !state.cargando) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                "No hay anuncios publicados",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 12.dp, bottom = 80.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                        ) {
                            items(state.anuncios, key = { it.id }) { anuncio ->
                                AnuncioCard(
                                    anuncio = anuncio,
                                    onClick = { onAnuncioClick(anuncio.id) },
                                )
                            }
                        }
                    }
                }
            }
        }

        FloatingActionButton(
            onClick = { viewModel.mostrarFormulario() },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp),
        ) {
            Icon(Icons.Filled.Add, contentDescription = "Publicar anuncio")
        }
    }

    if (state.mostrandoFormulario) {
        FormularioAnuncioDialog(
            guardando = state.guardando,
            error = state.errorGuardado,
            onDismiss = { viewModel.ocultarFormulario() },
            onConfirm = { tipo, titulo, descripcion, contacto ->
                viewModel.crearAnuncio(tipo, titulo, descripcion, contacto)
            },
        )
    }
}

@Composable
private fun AnuncioCard(anuncio: AnuncioDto, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top,
        ) {
            Icon(
                iconoParaTipo(anuncio.tipo),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(36.dp),
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = anuncio.titulo,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = etiquetaParaTipo(anuncio.tipo),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
                if (!anuncio.descripcion.isNullOrBlank()) {
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = anuncio.descripcion,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    text = formatearFecha(anuncio.fechaPublicacion),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FormularioAnuncioDialog(
    guardando: Boolean,
    error: String?,
    onDismiss: () -> Unit,
    onConfirm: (tipo: String, titulo: String, descripcion: String, contacto: String) -> Unit,
) {
    var tipoSeleccionado by remember { mutableStateOf(TIPOS_ANUNCIO.first().first) }
    var dropdownExpanded by remember { mutableStateOf(false) }
    var titulo by remember { mutableStateOf("") }
    var descripcion by remember { mutableStateOf("") }
    var contacto by remember { mutableStateOf("") }
    var tituloError by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = { if (!guardando) onDismiss() },
        title = { Text("Publicar anuncio") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ExposedDropdownMenuBox(
                    expanded = dropdownExpanded,
                    onExpandedChange = { dropdownExpanded = it },
                ) {
                    OutlinedTextField(
                        value = etiquetaParaTipo(tipoSeleccionado),
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Tipo") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(),
                    )
                    ExposedDropdownMenu(
                        expanded = dropdownExpanded,
                        onDismissRequest = { dropdownExpanded = false },
                    ) {
                        TIPOS_ANUNCIO.forEach { (clave, etiqueta) ->
                            DropdownMenuItem(
                                text = { Text(etiqueta) },
                                onClick = {
                                    tipoSeleccionado = clave
                                    dropdownExpanded = false
                                },
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = titulo,
                    onValueChange = {
                        titulo = it
                        tituloError = false
                    },
                    label = { Text("Título *") },
                    isError = tituloError,
                    supportingText = if (tituloError) {
                        { Text("El título es obligatorio") }
                    } else null,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )

                OutlinedTextField(
                    value = descripcion,
                    onValueChange = { descripcion = it },
                    label = { Text("Descripción") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 2,
                    maxLines = 4,
                )

                OutlinedTextField(
                    value = contacto,
                    onValueChange = { contacto = it },
                    label = { Text("Contacto") },
                    placeholder = { Text("Teléfono, email…") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )

                if (error != null) {
                    Text(
                        text = error,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (titulo.isBlank()) {
                        tituloError = true
                    } else {
                        onConfirm(tipoSeleccionado, titulo, descripcion, contacto)
                    }
                },
                enabled = !guardando,
            ) {
                if (guardando) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                } else {
                    Text("Publicar")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = !guardando) {
                Text("Cancelar")
            }
        },
    )
}

private fun iconoParaTipo(tipo: String): ImageVector = when (tipo) {
    "mascota_perdida" -> Icons.Filled.Pets
    "compra_venta" -> Icons.Filled.ShoppingBag
    "objeto_perdido" -> Icons.Filled.Search
    else -> Icons.Filled.Announcement
}

private fun etiquetaParaTipo(tipo: String): String =
    TIPOS_ANUNCIO.firstOrNull { it.first == tipo }?.second ?: tipo

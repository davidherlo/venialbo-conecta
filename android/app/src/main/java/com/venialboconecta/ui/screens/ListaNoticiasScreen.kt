package com.venialboconecta.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.venialboconecta.BuildConfig
import com.venialboconecta.ui.components.CategoriaChip
import com.venialboconecta.ui.components.NoticiaCard
import com.venialboconecta.viewmodel.ListaNoticiasViewModel

@Composable
fun ListaNoticiasScreen(
    onNoticiaClick: (Int) -> Unit,
    viewModel: ListaNoticiasViewModel = viewModel(),
) {
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()

    val debeCargarMas by remember {
        derivedStateOf {
            val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            lastVisible >= listState.layoutInfo.totalItemsCount - 3
        }
    }

    LaunchedEffect(debeCargarMas) {
        if (debeCargarMas && state.noticias.isNotEmpty()) {
            viewModel.cargarMas()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
            when {
                state.cargando && state.noticias.isEmpty() -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }

                state.error != null && state.noticias.isEmpty() -> {
                    Column(
                        modifier = Modifier.align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(
                            text = state.error ?: "",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyMedium,
                        )
                        TextButton(onClick = { viewModel.cargarDatos() }) {
                            Text("Reintentar")
                        }
                    }
                }

                else -> {
                    Column {
                        // Barra de búsqueda
                        OutlinedTextField(
                            value = state.busqueda,
                            onValueChange = { viewModel.buscar(it) },
                            placeholder = { Text("Buscar noticias...") },
                            leadingIcon = {
                                Icon(Icons.Filled.Search, contentDescription = null)
                            },
                            trailingIcon = {
                                if (state.busqueda.isNotEmpty()) {
                                    IconButton(onClick = { viewModel.buscar("") }) {
                                        Icon(Icons.Filled.Close, contentDescription = "Limpiar")
                                    }
                                }
                            },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                        )

                        // Filtro de categorías
                        if (state.categorias.isNotEmpty()) {
                            LazyRow(
                                contentPadding = PaddingValues(horizontal = 12.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                            ) {
                                item {
                                    CategoriaChip(
                                        nombre = "Todas",
                                        seleccionada = state.categoriaSeleccionada == null,
                                        onClick = { viewModel.filtrarPorCategoria(null) },
                                    )
                                }
                                items(state.categorias) { cat ->
                                    CategoriaChip(
                                        nombre = cat.nombre,
                                        seleccionada = state.categoriaSeleccionada == cat.id,
                                        onClick = { viewModel.filtrarPorCategoria(cat.id) },
                                    )
                                }
                            }
                        }

                        // Lista de noticias
                        if (state.noticias.isEmpty() && !state.cargando) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .weight(1f),
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    if (state.busqueda.isNotEmpty()) "Sin resultados para \"${state.busqueda}\""
                                    else "No hay noticias",
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        } else {
                            LazyColumn(
                                state = listState,
                                contentPadding = PaddingValues(12.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.weight(1f),
                            ) {
                                items(state.noticias, key = { it.id }) { noticia ->
                                    NoticiaCard(
                                        noticia = noticia,
                                        baseUrl = BuildConfig.API_BASE_URL,
                                        onClick = { onNoticiaClick(noticia.id) },
                                    )
                                }

                                // Indicador de carga al final
                                if (state.cargandoMas) {
                                    item {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(16.dp),
                                            contentAlignment = Alignment.Center,
                                        ) {
                                            CircularProgressIndicator(modifier = Modifier.size(24.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
}

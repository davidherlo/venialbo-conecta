package com.venialboconecta.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.EventBusy
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.venialboconecta.ui.components.InfoRow
import com.venialboconecta.ui.util.formatearFecha
import com.venialboconecta.viewmodel.DetalleAnuncioViewModel
import com.venialboconecta.viewmodel.TIPOS_ANUNCIO

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetalleAnuncioScreen(
    anuncioId: Int,
    onBack: () -> Unit,
    viewModel: DetalleAnuncioViewModel = viewModel(
        factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T =
                DetalleAnuncioViewModel(anuncioId) as T
        }
    ),
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.anuncio?.titulo ?: "Anuncio") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary,
                ),
            )
        },
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
        ) {
            when {
                state.cargando -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }

                state.error != null -> {
                    Column(
                        modifier = Modifier.align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                        TextButton(onClick = { viewModel.cargarDatos() }) { Text("Reintentar") }
                    }
                }

                state.anuncio != null -> {
                    val anuncio = state.anuncio!!
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(16.dp),
                    ) {
                        Text(
                            text = anuncio.titulo,
                            style = MaterialTheme.typography.headlineSmall,
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = etiquetaParaTipoDetalle(anuncio.tipo),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                        Spacer(Modifier.height(16.dp))

                        if (!anuncio.descripcion.isNullOrBlank()) {
                            Text(
                                text = anuncio.descripcion,
                                style = MaterialTheme.typography.bodyMedium,
                            )
                            Spacer(Modifier.height(16.dp))
                        }

                        HorizontalDivider()

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            if (!anuncio.contacto.isNullOrBlank()) {
                                InfoRow(
                                    icono = { Icon(Icons.Filled.Phone, null, Modifier.size(18.dp)) },
                                    texto = anuncio.contacto,
                                )
                            }
                            InfoRow(
                                icono = { Icon(Icons.Filled.CalendarToday, null, Modifier.size(18.dp)) },
                                texto = "Publicado: ${formatearFecha(anuncio.fechaPublicacion)}",
                            )
                            InfoRow(
                                icono = { Icon(Icons.Filled.EventBusy, null, Modifier.size(18.dp)) },
                                texto = "Caduca: ${formatearFecha(anuncio.fechaCaducidad)}",
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun etiquetaParaTipoDetalle(tipo: String): String =
    TIPOS_ANUNCIO.firstOrNull { it.first == tipo }?.second ?: tipo

package com.venialboconecta.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.venialboconecta.ui.components.InfoRow
import com.venialboconecta.viewmodel.DetalleServicioViewModel
import com.venialboconecta.viewmodel.TIPOS_SERVICIO

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetalleServicioScreen(
    servicioId: Int,
    onBack: () -> Unit,
    viewModel: DetalleServicioViewModel = viewModel(
        factory = DetalleServicioViewModel.Factory(servicioId),
    ),
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.servicio?.nombre ?: "Servicio") },
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
        when {
            state.cargando -> CircularProgressIndicator(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .wrapContentSize(Alignment.Center),
            )

            state.error != null -> Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
            ) {
                Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                TextButton(onClick = { viewModel.cargar() }) { Text("Reintentar") }
            }

            state.servicio != null -> {
                val servicio = state.servicio!!
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = TIPOS_SERVICIO.firstOrNull { it.first == servicio.tipo }?.second ?: servicio.tipo,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )

                    if (servicio.descripcion != null) {
                        Text(servicio.descripcion, style = MaterialTheme.typography.bodyLarge)
                    }

                    HorizontalDivider()

                    if (servicio.direccion != null) {
                        InfoRow(icono = { Icon(Icons.Filled.Schedule, null, Modifier.size(18.dp)) }, texto = servicio.direccion)
                    }
                    if (servicio.horario != null) {
                        InfoRow(icono = { Icon(Icons.Filled.Schedule, null, Modifier.size(18.dp)) }, texto = servicio.horario)
                    }
                    if (servicio.informacionAdicional != null) {
                        HorizontalDivider()
                        Text(
                            text = "Información adicional",
                            style = MaterialTheme.typography.titleSmall,
                        )
                        Text(servicio.informacionAdicional, style = MaterialTheme.typography.bodyMedium)
                    }

                    Spacer(Modifier.size(4.dp))

                    if (servicio.telefono != null) {
                        Button(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${servicio.telefono}")))
                            },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Icon(Icons.Filled.Phone, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                            Text("Llamar · ${servicio.telefono}")
                        }
                    }
                }
            }
        }
    }
}

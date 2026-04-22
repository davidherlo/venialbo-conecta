package com.venialboconecta.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import com.venialboconecta.viewmodel.DetalleNegocioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetalleNegocioScreen(
    negocioId: Int,
    onBack: () -> Unit,
    viewModel: DetalleNegocioViewModel = viewModel(
        factory = DetalleNegocioViewModel.Factory(negocioId),
    ),
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.negocio?.nombre ?: "Negocio") },
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

            state.negocio != null -> {
                val negocio = state.negocio!!
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    if (negocio.categoriaNegocio != null) {
                        Text(
                            text = negocio.categoriaNegocio,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }

                    if (negocio.descripcion != null) {
                        Text(
                            text = negocio.descripcion,
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }

                    HorizontalDivider()

                    // Dirección y horario
                    if (negocio.direccion != null) {
                        InfoRow(icono = { Icon(Icons.Filled.Share, null, Modifier.size(18.dp)) }, texto = negocio.direccion)
                    }
                    if (negocio.horario != null) {
                        InfoRow(icono = { Icon(Icons.Filled.Schedule, null, Modifier.size(18.dp)) }, texto = negocio.horario)
                    }

                    Spacer(Modifier.height(4.dp))

                    // Botones de acción
                    if (negocio.telefono != null) {
                        Button(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${negocio.telefono}")))
                            },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Icon(Icons.Filled.Phone, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                            Text("Llamar · ${negocio.telefono}")
                        }
                    }

                    if (negocio.email != null) {
                        OutlinedButton(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${negocio.email}")))
                            },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Icon(Icons.Filled.Email, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                            Text("Enviar email")
                        }
                    }

                    if (negocio.webUrl != null) {
                        OutlinedButton(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(negocio.webUrl)))
                            },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Icon(Icons.Filled.Language, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                            Text("Abrir web")
                        }
                    }

                    // Redes sociales
                    negocio.redesSociales?.forEach { (red, url) ->
                        OutlinedButton(
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                            },
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text(red.replaceFirstChar { it.uppercase() })
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun InfoRow(icono: @Composable () -> Unit, texto: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        icono()
        Text(texto, style = MaterialTheme.typography.bodyMedium)
    }
}

package com.venialboconecta.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import android.content.Intent
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.venialboconecta.BuildConfig
import com.venialboconecta.ui.util.formatearFecha
import com.venialboconecta.viewmodel.DetalleNoticiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetalleNoticiaScreen(
    noticiaId: Int,
    onBack: () -> Unit,
    viewModel: DetalleNoticiaViewModel = viewModel(
        factory = DetalleNoticiaViewModel.Factory(noticiaId),
    ),
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.noticia?.categoria?.nombre ?: "") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Volver",
                        )
                    }
                },
                actions = {
                    if (state.noticia != null) {
                        IconButton(onClick = {
                            val noticia = state.noticia!!
                            val texto = "${noticia.titulo}\n\n${noticia.contenido.take(200)}...\n\n— VenialboConecta"
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_SUBJECT, noticia.titulo)
                                putExtra(Intent.EXTRA_TEXT, texto)
                            }
                            context.startActivity(Intent.createChooser(intent, "Compartir noticia"))
                        }) {
                            Icon(
                                Icons.Filled.Share,
                                contentDescription = "Compartir",
                                tint = MaterialTheme.colorScheme.onPrimary,
                            )
                        }
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
            state.cargando -> {
                CircularProgressIndicator(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .wrapContentSize(Alignment.Center),
                )
            }

            state.error != null -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text(
                        text = state.error ?: "",
                        color = MaterialTheme.colorScheme.error,
                    )
                    TextButton(onClick = { viewModel.cargar() }) {
                        Text("Reintentar")
                    }
                }
            }

            state.noticia != null -> {
                val noticia = state.noticia!!
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(rememberScrollState()),
                ) {
                    // Imagen o placeholder
                    if (noticia.imagenUrl != null) {
                        AsyncImage(
                            model = "${BuildConfig.API_BASE_URL}/${noticia.imagenUrl}",
                            contentDescription = noticia.titulo,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(240.dp),
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .background(MaterialTheme.colorScheme.surfaceVariant),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(
                                Icons.Filled.Newspaper,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f),
                                modifier = Modifier.size(80.dp),
                            )
                        }
                    }

                    Column(modifier = Modifier.padding(16.dp)) {
                        // Categoría y fecha
                        Text(
                            text = "${noticia.categoria.nombre}  ·  ${formatearFecha(noticia.fechaPublicacion)}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary,
                        )

                        Spacer(Modifier.height(8.dp))

                        // Título
                        Text(
                            text = noticia.titulo,
                            style = MaterialTheme.typography.headlineSmall,
                        )

                        Spacer(Modifier.height(16.dp))

                        // Contenido
                        Text(
                            text = noticia.contenido,
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                }
            }
        }
    }
}

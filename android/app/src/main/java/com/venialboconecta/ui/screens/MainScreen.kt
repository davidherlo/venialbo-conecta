package com.venialboconecta.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onNoticiaClick: (Int) -> Unit,
    onNegocioClick: (Int) -> Unit,
    onServicioClick: (Int) -> Unit,
    onAnuncioClick: (Int) -> Unit,
) {
    var tabSeleccionado by rememberSaveable { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("VenialboConecta") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                ),
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = tabSeleccionado == 0,
                    onClick = { tabSeleccionado = 0 },
                    icon = { Icon(Icons.Filled.Newspaper, contentDescription = null) },
                    label = { Text("Noticias") },
                )
                NavigationBarItem(
                    selected = tabSeleccionado == 1,
                    onClick = { tabSeleccionado = 1 },
                    icon = { Icon(Icons.Filled.Store, contentDescription = null) },
                    label = { Text("Negocios") },
                )
                NavigationBarItem(
                    selected = tabSeleccionado == 2,
                    onClick = { tabSeleccionado = 2 },
                    icon = { Icon(Icons.Filled.MedicalServices, contentDescription = null) },
                    label = { Text("Servicios") },
                )
                NavigationBarItem(
                    selected = tabSeleccionado == 3,
                    onClick = { tabSeleccionado = 3 },
                    icon = { Icon(Icons.Filled.Campaign, contentDescription = null) },
                    label = { Text("Tablón") },
                )
            }
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
        ) {
            when (tabSeleccionado) {
                0 -> ListaNoticiasScreen(onNoticiaClick = onNoticiaClick)
                1 -> ListaNegociosScreen(onNegocioClick = onNegocioClick)
                2 -> ListaServiciosScreen(onServicioClick = onServicioClick)
                3 -> ListaAnunciosScreen(onAnuncioClick = onAnuncioClick)
            }
        }
    }
}

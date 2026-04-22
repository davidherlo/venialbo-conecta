package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.ServicioDto
import com.venialboconecta.data.repository.ServicioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ListaServiciosUiState(
    val servicios: List<ServicioDto> = emptyList(),
    val tipoSeleccionado: String? = null,
    val cargando: Boolean = false,
    val error: String? = null,
)

val TIPOS_SERVICIO = listOf(
    "medico" to "Médico",
    "comedor" to "Comedor",
    "bibliobus" to "Bibliobús",
    "venta_ambulante" to "Venta ambulante",
    "otro" to "Otro",
)

class ListaServiciosViewModel(
    private val repository: ServicioRepository = ServicioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListaServiciosUiState())
    val uiState: StateFlow<ListaServiciosUiState> = _uiState

    init {
        cargarDatos()
    }

    fun cargarDatos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val servicios = repository.getServicios(_uiState.value.tipoSeleccionado)
                _uiState.value = _uiState.value.copy(servicios = servicios, cargando = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudieron cargar los servicios: ${e.message}",
                )
            }
        }
    }

    fun filtrarPorTipo(tipo: String?) {
        _uiState.value = _uiState.value.copy(tipoSeleccionado = tipo)
        cargarDatos()
    }
}

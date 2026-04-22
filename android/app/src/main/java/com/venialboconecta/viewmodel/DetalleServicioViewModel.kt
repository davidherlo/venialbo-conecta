package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.ServicioDto
import com.venialboconecta.data.repository.ServicioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DetalleServicioUiState(
    val servicio: ServicioDto? = null,
    val cargando: Boolean = false,
    val error: String? = null,
)

class DetalleServicioViewModel(
    private val servicioId: Int,
    private val repository: ServicioRepository = ServicioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(DetalleServicioUiState())
    val uiState: StateFlow<DetalleServicioUiState> = _uiState

    init {
        cargar()
    }

    fun cargar() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val servicio = repository.getServicio(servicioId)
                _uiState.value = _uiState.value.copy(servicio = servicio, cargando = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudo cargar el servicio: ${e.message}",
                )
            }
        }
    }

    class Factory(private val servicioId: Int) : ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            @Suppress("UNCHECKED_CAST")
            return DetalleServicioViewModel(servicioId) as T
        }
    }
}

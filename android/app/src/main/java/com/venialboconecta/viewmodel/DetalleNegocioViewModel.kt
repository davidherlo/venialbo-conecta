package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.NegocioDto
import com.venialboconecta.data.repository.NegocioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DetalleNegocioUiState(
    val negocio: NegocioDto? = null,
    val cargando: Boolean = false,
    val error: String? = null,
)

class DetalleNegocioViewModel(
    private val negocioId: Int,
    private val repository: NegocioRepository = NegocioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(DetalleNegocioUiState())
    val uiState: StateFlow<DetalleNegocioUiState> = _uiState

    init {
        cargar()
    }

    fun cargar() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val negocio = repository.getNegocio(negocioId)
                _uiState.value = _uiState.value.copy(negocio = negocio, cargando = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudo cargar el negocio: ${e.message}",
                )
            }
        }
    }

    class Factory(private val negocioId: Int) : ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            @Suppress("UNCHECKED_CAST")
            return DetalleNegocioViewModel(negocioId) as T
        }
    }
}

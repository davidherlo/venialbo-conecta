package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.NegocioDto
import com.venialboconecta.data.repository.NegocioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ListaNegociosUiState(
    val negocios: List<NegocioDto> = emptyList(),
    val categorias: List<String> = emptyList(),
    val categoriaSeleccionada: String? = null,
    val cargando: Boolean = false,
    val error: String? = null,
)

class ListaNegociosViewModel(
    private val repository: NegocioRepository = NegocioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListaNegociosUiState())
    val uiState: StateFlow<ListaNegociosUiState> = _uiState

    init {
        cargarDatos()
    }

    fun cargarDatos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val categorias = repository.getCategorias()
                val negocios = repository.getNegocios(_uiState.value.categoriaSeleccionada)
                _uiState.value = _uiState.value.copy(
                    negocios = negocios,
                    categorias = categorias,
                    cargando = false,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudieron cargar los negocios: ${e.message}",
                )
            }
        }
    }

    fun filtrarPorCategoria(categoria: String?) {
        _uiState.value = _uiState.value.copy(categoriaSeleccionada = categoria)
        cargarDatos()
    }
}

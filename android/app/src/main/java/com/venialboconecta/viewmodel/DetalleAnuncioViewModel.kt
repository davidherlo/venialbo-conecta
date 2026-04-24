package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.VenialboConectaApp
import com.venialboconecta.data.api.dto.AnuncioDto
import com.venialboconecta.data.repository.AnuncioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DetalleAnuncioUiState(
    val anuncio: AnuncioDto? = null,
    val cargando: Boolean = false,
    val error: String? = null,
    val isAutorOAdmin: Boolean = false,
)

class DetalleAnuncioViewModel(
    private val anuncioId: Int,
    private val repository: AnuncioRepository = AnuncioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(DetalleAnuncioUiState())
    val uiState: StateFlow<DetalleAnuncioUiState> = _uiState

    init {
        cargarDatos()
    }

    fun cargarDatos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val anuncio = repository.getAnuncio(anuncioId)
                val session = VenialboConectaApp.sessionManager
                val isAutorOAdmin = session.isAdmin
                _uiState.value = _uiState.value.copy(
                    anuncio = anuncio,
                    cargando = false,
                    isAutorOAdmin = isAutorOAdmin,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudo cargar el anuncio: ${e.message}",
                )
            }
        }
    }
}

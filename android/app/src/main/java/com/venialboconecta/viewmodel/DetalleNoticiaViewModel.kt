package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.NoticiaDetalleDto
import com.venialboconecta.data.repository.NoticiaRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DetalleNoticiaUiState(
    val noticia: NoticiaDetalleDto? = null,
    val cargando: Boolean = false,
    val error: String? = null,
)

class DetalleNoticiaViewModel(
    private val noticiaId: Int,
    private val repository: NoticiaRepository = NoticiaRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(DetalleNoticiaUiState())
    val uiState: StateFlow<DetalleNoticiaUiState> = _uiState

    init {
        cargar()
    }

    fun cargar() {
        viewModelScope.launch {
            _uiState.value = DetalleNoticiaUiState(cargando = true)
            try {
                val noticia = repository.getNoticia(noticiaId)
                _uiState.value = DetalleNoticiaUiState(noticia = noticia)
            } catch (e: Exception) {
                _uiState.value = DetalleNoticiaUiState(
                    error = "No se pudo cargar la noticia: ${e.message}",
                )
            }
        }
    }

    class Factory(private val noticiaId: Int) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T =
            DetalleNoticiaViewModel(noticiaId) as T
    }
}

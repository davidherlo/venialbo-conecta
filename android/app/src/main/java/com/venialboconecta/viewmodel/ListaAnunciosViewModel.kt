package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.api.dto.AnuncioDto
import com.venialboconecta.data.repository.AnuncioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

val TIPOS_ANUNCIO = listOf(
    "mascota_perdida" to "Mascota perdida",
    "compra_venta" to "Compra-venta",
    "objeto_perdido" to "Objeto perdido",
    "otro" to "Otro",
)

data class ListaAnunciosUiState(
    val anuncios: List<AnuncioDto> = emptyList(),
    val tipoSeleccionado: String? = null,
    val cargando: Boolean = false,
    val error: String? = null,
    val mostrandoFormulario: Boolean = false,
    val guardando: Boolean = false,
    val errorGuardado: String? = null,
)

class ListaAnunciosViewModel(
    private val repository: AnuncioRepository = AnuncioRepository(),
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListaAnunciosUiState())
    val uiState: StateFlow<ListaAnunciosUiState> = _uiState

    init {
        cargarDatos()
    }

    fun cargarDatos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val anuncios = repository.getAnuncios(_uiState.value.tipoSeleccionado)
                _uiState.value = _uiState.value.copy(anuncios = anuncios, cargando = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudieron cargar los anuncios: ${e.message}",
                )
            }
        }
    }

    fun filtrarPorTipo(tipo: String?) {
        _uiState.value = _uiState.value.copy(tipoSeleccionado = tipo)
        cargarDatos()
    }

    fun mostrarFormulario() {
        _uiState.value = _uiState.value.copy(mostrandoFormulario = true, errorGuardado = null)
    }

    fun ocultarFormulario() {
        _uiState.value = _uiState.value.copy(mostrandoFormulario = false, errorGuardado = null)
    }

    fun crearAnuncio(tipo: String, titulo: String, descripcion: String, contacto: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(guardando = true, errorGuardado = null)
            try {
                repository.crearAnuncio(tipo, titulo, descripcion, contacto)
                _uiState.value = _uiState.value.copy(guardando = false, mostrandoFormulario = false)
                cargarDatos()
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    guardando = false,
                    errorGuardado = "No se pudo publicar el anuncio: ${e.message}",
                )
            }
        }
    }
}

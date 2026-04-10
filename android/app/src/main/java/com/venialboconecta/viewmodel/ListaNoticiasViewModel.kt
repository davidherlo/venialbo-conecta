package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.VenialboConectaApp
import com.venialboconecta.data.api.dto.CategoriaDto
import com.venialboconecta.data.api.dto.NoticiaListDto
import com.venialboconecta.data.repository.NoticiaRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ListaNoticiasUiState(
    val noticias: List<NoticiaListDto> = emptyList(),
    val categorias: List<CategoriaDto> = emptyList(),
    val categoriaSeleccionada: Int? = null,
    val busqueda: String = "",
    val cargando: Boolean = false,
    val cargandoMas: Boolean = false,
    val hayMas: Boolean = true,
    val error: String? = null,
)

private const val PAGE_SIZE = 20

class ListaNoticiasViewModel(
    private val repository: NoticiaRepository = NoticiaRepository(
        context = VenialboConectaApp.instance,
    ),
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListaNoticiasUiState())
    val uiState: StateFlow<ListaNoticiasUiState> = _uiState

    private var busquedaJob: Job? = null

    init {
        cargarDatos()
    }

    fun cargarDatos() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(cargando = true, error = null)
            try {
                val categorias = repository.getCategorias()
                val state = _uiState.value
                val noticias = repository.getNoticias(
                    categoriaId = state.categoriaSeleccionada,
                    busqueda = state.busqueda.ifBlank { null },
                    skip = 0,
                    limit = PAGE_SIZE,
                )
                _uiState.value = state.copy(
                    noticias = noticias,
                    categorias = categorias,
                    cargando = false,
                    hayMas = noticias.size >= PAGE_SIZE,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    cargando = false,
                    error = "No se pudieron cargar las noticias: ${e.message}",
                )
            }
        }
    }

    fun cargarMas() {
        val state = _uiState.value
        if (state.cargandoMas || !state.hayMas) return

        viewModelScope.launch {
            _uiState.value = state.copy(cargandoMas = true)
            try {
                val nuevas = repository.getNoticias(
                    categoriaId = state.categoriaSeleccionada,
                    busqueda = state.busqueda.ifBlank { null },
                    skip = state.noticias.size,
                    limit = PAGE_SIZE,
                )
                _uiState.value = _uiState.value.copy(
                    noticias = state.noticias + nuevas,
                    cargandoMas = false,
                    hayMas = nuevas.size >= PAGE_SIZE,
                )
            } catch (_: Exception) {
                _uiState.value = _uiState.value.copy(cargandoMas = false)
            }
        }
    }

    fun filtrarPorCategoria(categoriaId: Int?) {
        _uiState.value = _uiState.value.copy(categoriaSeleccionada = categoriaId)
        cargarDatos()
    }

    fun buscar(texto: String) {
        _uiState.value = _uiState.value.copy(busqueda = texto)
        busquedaJob?.cancel()
        busquedaJob = viewModelScope.launch {
            delay(400) // debounce
            cargarDatos()
        }
    }
}

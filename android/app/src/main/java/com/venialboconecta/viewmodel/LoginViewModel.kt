package com.venialboconecta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venialboconecta.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class LoginUiState {
    object Idle : LoginUiState()
    object Loading : LoginUiState()
    object Success : LoginUiState()
    data class Error(val mensaje: String) : LoginUiState()
}

class LoginViewModel : ViewModel() {

    private val repository = AuthRepository()

    private val _uiState = MutableStateFlow<LoginUiState>(LoginUiState.Idle)
    val uiState: StateFlow<LoginUiState> = _uiState

    fun mostrarError(mensaje: String) {
        _uiState.value = LoginUiState.Error(mensaje)
    }

    fun loginConGoogle(idToken: String) {
        _uiState.value = LoginUiState.Loading
        viewModelScope.launch {
            repository.loginConGoogle(idToken)
                .onSuccess { _uiState.value = LoginUiState.Success }
                .onFailure { _uiState.value = LoginUiState.Error(it.message ?: "Error desconocido") }
        }
    }

    fun loginDev(email: String, nombre: String, rol: String) {
        _uiState.value = LoginUiState.Loading
        viewModelScope.launch {
            repository.loginDev(email, nombre, rol)
                .onSuccess { _uiState.value = LoginUiState.Success }
                .onFailure { _uiState.value = LoginUiState.Error(it.message ?: "Error desconocido") }
        }
    }
}

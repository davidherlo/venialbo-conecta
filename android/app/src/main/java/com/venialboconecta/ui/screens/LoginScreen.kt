package com.venialboconecta.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.venialboconecta.BuildConfig
import com.venialboconecta.viewmodel.LoginUiState
import com.venialboconecta.viewmodel.LoginViewModel
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onLoginExitoso: () -> Unit) {
    val viewModel: LoginViewModel = viewModel()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    LaunchedEffect(uiState) {
        if (uiState is LoginUiState.Success) onLoginExitoso()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "VenialboConecta",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "El portal de novedades de tu pueblo",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.height(64.dp))

        if (uiState is LoginUiState.Loading) {
            CircularProgressIndicator()
        } else {
            Button(
                onClick = {
                    scope.launch {
                        when (val resultado = obtenerIdTokenGoogle(context)) {
                            is ResultadoGoogle.Exito -> viewModel.loginConGoogle(resultado.idToken)
                            is ResultadoGoogle.Error -> viewModel.mostrarError(resultado.mensaje)
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Entrar con Google")
            }
        }

        if (uiState is LoginUiState.Error) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = (uiState as LoginUiState.Error).mensaje,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
            )
        }
    }
}

sealed class ResultadoGoogle {
    data class Exito(val idToken: String) : ResultadoGoogle()
    data class Error(val mensaje: String) : ResultadoGoogle()
}

private suspend fun obtenerIdTokenGoogle(context: android.content.Context): ResultadoGoogle {
    return try {
        val credentialManager = CredentialManager.create(context)
        val signInOption = GetSignInWithGoogleOption.Builder(BuildConfig.GOOGLE_CLIENT_ID)
            .build()
        val request = GetCredentialRequest.Builder()
            .addCredentialOption(signInOption)
            .build()
        val result = credentialManager.getCredential(context, request)
        val credential = GoogleIdTokenCredential.createFrom(result.credential.data)
        ResultadoGoogle.Exito(credential.idToken)
    } catch (e: GetCredentialException) {
        ResultadoGoogle.Error("Error Google: ${e.javaClass.simpleName} — ${e.message}")
    } catch (e: Exception) {
        ResultadoGoogle.Error("Error inesperado: ${e.javaClass.simpleName} — ${e.message}")
    }
}

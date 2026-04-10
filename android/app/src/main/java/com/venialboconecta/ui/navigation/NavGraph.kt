package com.venialboconecta.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.venialboconecta.VenialboConectaApp
import com.venialboconecta.ui.screens.DetalleNoticiaScreen
import com.venialboconecta.ui.screens.ListaNoticiasScreen
import com.venialboconecta.ui.screens.LoginScreen
import com.venialboconecta.ui.screens.SplashScreen

object Rutas {
    const val SPLASH = "splash"
    const val LOGIN = "login"
    const val LISTA_NOTICIAS = "lista_noticias"
    const val DETALLE_NOTICIA = "detalle_noticia/{noticiaId}"

    fun detalle(id: Int) = "detalle_noticia/$id"
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Rutas.SPLASH) {

        composable(Rutas.SPLASH) {
            SplashScreen(
                onFinished = {
                    val destino = if (VenialboConectaApp.sessionManager.isLoggedIn)
                        Rutas.LISTA_NOTICIAS else Rutas.LOGIN
                    navController.navigate(destino) {
                        popUpTo(Rutas.SPLASH) { inclusive = true }
                    }
                },
            )
        }

        composable(Rutas.LOGIN) {
            LoginScreen(
                onLoginExitoso = {
                    navController.navigate(Rutas.LISTA_NOTICIAS) {
                        popUpTo(Rutas.LOGIN) { inclusive = true }
                    }
                },
            )
        }

        composable(Rutas.LISTA_NOTICIAS) {
            ListaNoticiasScreen(
                onNoticiaClick = { id -> navController.navigate(Rutas.detalle(id)) },
            )
        }

        composable(
            route = Rutas.DETALLE_NOTICIA,
            arguments = listOf(navArgument("noticiaId") { type = NavType.IntType }),
        ) { backStackEntry ->
            val noticiaId = backStackEntry.arguments?.getInt("noticiaId") ?: return@composable
            DetalleNoticiaScreen(
                noticiaId = noticiaId,
                onBack = { navController.popBackStack() },
            )
        }
    }
}

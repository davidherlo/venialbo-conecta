package com.venialboconecta.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.venialboconecta.VenialboConectaApp
import com.venialboconecta.ui.screens.DetalleNegocioScreen
import com.venialboconecta.ui.screens.DetalleNoticiaScreen
import com.venialboconecta.ui.screens.LoginScreen
import com.venialboconecta.ui.screens.MainScreen
import com.venialboconecta.ui.screens.SplashScreen

object Rutas {
    const val SPLASH = "splash"
    const val LOGIN = "login"
    const val MAIN = "main"
    const val DETALLE_NOTICIA = "detalle_noticia/{noticiaId}"
    const val DETALLE_NEGOCIO = "detalle_negocio/{negocioId}"

    fun detalleNoticia(id: Int) = "detalle_noticia/$id"
    fun detalleNegocio(id: Int) = "detalle_negocio/$id"
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Rutas.SPLASH) {

        composable(Rutas.SPLASH) {
            SplashScreen(
                onFinished = {
                    val destino = if (VenialboConectaApp.sessionManager.isLoggedIn)
                        Rutas.MAIN else Rutas.LOGIN
                    navController.navigate(destino) {
                        popUpTo(Rutas.SPLASH) { inclusive = true }
                    }
                },
            )
        }

        composable(Rutas.LOGIN) {
            LoginScreen(
                onLoginExitoso = {
                    navController.navigate(Rutas.MAIN) {
                        popUpTo(Rutas.LOGIN) { inclusive = true }
                    }
                },
            )
        }

        composable(Rutas.MAIN) {
            MainScreen(
                onNoticiaClick = { id -> navController.navigate(Rutas.detalleNoticia(id)) },
                onNegocioClick = { id -> navController.navigate(Rutas.detalleNegocio(id)) },
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

        composable(
            route = Rutas.DETALLE_NEGOCIO,
            arguments = listOf(navArgument("negocioId") { type = NavType.IntType }),
        ) { backStackEntry ->
            val negocioId = backStackEntry.arguments?.getInt("negocioId") ?: return@composable
            DetalleNegocioScreen(
                negocioId = negocioId,
                onBack = { navController.popBackStack() },
            )
        }
    }
}

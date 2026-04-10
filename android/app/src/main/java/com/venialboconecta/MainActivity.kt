package com.venialboconecta

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.rememberNavController
import com.venialboconecta.ui.navigation.NavGraph
import com.venialboconecta.ui.theme.VenialboConectaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            VenialboConectaTheme {
                val navController = rememberNavController()
                NavGraph(navController = navController)
            }
        }
    }
}

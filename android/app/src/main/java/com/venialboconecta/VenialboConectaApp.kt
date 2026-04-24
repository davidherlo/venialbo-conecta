package com.venialboconecta

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.google.firebase.messaging.FirebaseMessaging
import com.venialboconecta.data.repository.SessionManager

class VenialboConectaApp : Application() {

    companion object {
        lateinit var instance: VenialboConectaApp
            private set
        lateinit var sessionManager: SessionManager
            private set
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        sessionManager = SessionManager(this)
        crearCanalNotificaciones()
        suscribirseATopics()
    }

    private fun crearCanalNotificaciones() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val canal = NotificationChannel(
                VenialboFirebaseMessagingService.CHANNEL_ID,
                "Noticias y avisos",
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Notificaciones de noticias destacadas y avisos urgentes del pueblo"
            }
            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(canal)
        }
    }

    private fun suscribirseATopics() {
        FirebaseMessaging.getInstance().apply {
            subscribeToTopic("noticias_destacadas")
            subscribeToTopic("avisos_urgentes")
        }
    }
}

package com.venialboconecta

import android.app.Application
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
    }
}

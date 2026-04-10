package com.venialboconecta

import android.app.Application

class VenialboConectaApp : Application() {

    companion object {
        lateinit var instance: VenialboConectaApp
            private set
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}

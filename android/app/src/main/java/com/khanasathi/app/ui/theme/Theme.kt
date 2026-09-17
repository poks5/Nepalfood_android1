package com.khanasathi.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = Emerald500,
    onPrimary = Neutral900,
    primaryContainer = Emerald800,
    onPrimaryContainer = Emerald100,
    secondary = Amber500,
    surface = Neutral800,
    onSurface = Neutral50,
    background = Neutral900,
    onBackground = Neutral50
)

private val LightColorScheme = lightColorScheme(
    primary = Emerald600,
    onPrimary = Emerald50,
    primaryContainer = Emerald100,
    onPrimaryContainer = Emerald900,
    secondary = Amber600,
    surface = androidx.compose.ui.graphics.Color.White,
    onSurface = Neutral900,
    background = Neutral50,
    onBackground = Neutral900
)

@Composable
fun KhanaSathiTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

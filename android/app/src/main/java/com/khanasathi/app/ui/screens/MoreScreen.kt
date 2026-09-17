package com.khanasathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khanasathi.app.ui.theme.*

@Composable
fun MoreScreen(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(bottom = 90.dp)
    ) {
        // Header
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 1.dp
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "About the Database & App",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Scientific references, methodology, and local offline architecture",
                    fontSize = 13.sp,
                    color = Neutral600
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Column(modifier = Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            // Source Documents Card
            InfoSectionCard(
                title = "Official Source Documents",
                icon = Icons.Outlined.LibraryBooks
            ) {
                DocumentItem(
                    title = "NARC 2024 Edition",
                    desc = "Nepal Food Composition Database (134 indigenous and localized food records, high-resolution photographic plates)",
                    badge = "Latest (2024)"
                )
                Divider(color = Neutral100, modifier = Modifier.padding(vertical = 8.dp))
                DocumentItem(
                    title = "DFTQC 2012 Edition",
                    desc = "Food Composition Table for Nepal, Department of Food Technology and Quality Control, Ministry of Agriculture (510 foundational entries)",
                    badge = "Standard (2012)"
                )
            }

            // Scientific Methodology Card
            InfoSectionCard(
                title = "Laboratory & Analytical Standards",
                icon = Icons.Outlined.Science
            ) {
                MethodRow("Energy Calculation", "Calculated via Atwater conversion factors (4 kcal/g protein, 9 kcal/g fat, 4 kcal/g carbs)")
                MethodRow("Protein Determination", "Micro-Kjeldahl total nitrogen × standard nitrogen-to-protein conversion factor (6.25)")
                MethodRow("Mineral Analysis", "Atomic Absorption Spectrophotometry (AAS) & flame photometry for Ca, Fe, Zn, P, Na, K")
                MethodRow("Carotenoids & Vit C", "UV-Vis spectrophotometry and 2,6-dichlorophenolindophenol visual titration method")
            }

            // Offline Architecture Card
            InfoSectionCard(
                title = "Android Native Architecture (Option 3)",
                icon = Icons.Outlined.Smartphone
            ) {
                MethodRow("Data Engine", "Native Room Database (SQLite) pre-seeded from assets/database.json")
                MethodRow("Search & Filtering", "Full-text indexing with real-time reactive Kotlin StateFlows")
                MethodRow("Image Pipeline", "Coil asynchronous image loader reading high-res photographic specimens from APK assets")
                MethodRow("UI Framework", "100% Jetpack Compose with Material 3 design system")
                MethodRow("Offline Privacy", "Zero analytics, zero tracking, zero external network dependency")
            }

            // Copyright & Attribution
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Emerald50,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "National Agricultural Research Council (NARC)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = Emerald900
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "In collaboration with Department of Food Technology and Quality Control (DFTQC), Babarmahal, Kathmandu, Nepal.",
                        fontSize = 11.sp,
                        color = Emerald800,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}

@Composable
fun InfoSectionCard(
    title: String,
    icon: ImageVector,
    content: @Composable ColumnScope.() -> Unit
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = icon, contentDescription = null, tint = Emerald700, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
fun DocumentItem(title: String, desc: String, badge: String) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Neutral800)
            Surface(color = Emerald100, shape = RoundedCornerShape(6.dp)) {
                Text(
                    text = badge,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Emerald900,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = desc, fontSize = 12.sp, color = Neutral600, lineHeight = 16.sp)
    }
}

@Composable
fun MethodRow(title: String, detail: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = Neutral800)
        Text(text = detail, fontSize = 12.sp, color = Neutral600, lineHeight = 16.sp)
    }
}

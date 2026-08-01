package com.strategycore.app;

import android.os.Bundle;
import android.view.View;

import androidx.core.view.WindowCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private BillingManager billingManager;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Activa edge‑to‑edge
        WindowCompat.enableEdgeToEdge(getWindow());

        // Ajusta el layout raíz para que no quede nada tapado
        View rootView = findViewById(R.id.rootView);

        ViewCompat.setOnApplyWindowInsetsListener(rootView, (view, insets) -> {
            WindowInsetsCompat.Insets systemBars =
                    insets.getInsets(WindowInsetsCompat.Type.systemBars());
            view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        // Tu lógica existente
        billingManager = new BillingManager(this);
        billingManager.startConnection();
    }
}





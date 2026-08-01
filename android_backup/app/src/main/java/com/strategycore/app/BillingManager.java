package com.strategycore.app;

import android.app.Activity;
import com.android.billingclient.api.*;

import java.util.ArrayList;
import java.util.List;

public class BillingManager {

    private BillingClient billingClient;

    public BillingManager(Activity activity) {
        billingClient = BillingClient.newBuilder(activity)
                .setListener((billingResult, purchases) -> {
                    // No vendes nada, pero debes manejar la respuesta
                })
                .enablePendingPurchases()
                .build();
    }

    public void startConnection() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    queryProducts();
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Reintentar si se desconecta
            }
        });
    }

    private void queryProducts() {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                        .setProductId("dummy_product")
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
        );

        QueryProductDetailsParams params =
                QueryProductDetailsParams.newBuilder()
                        .setProductList(productList)
                        .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            // No vendes nada, pero debes manejar la respuesta
        });
    }
}

package com.strategycore.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.games.AchievementsClient;
import com.google.android.gms.games.GameStatsClient;
import com.google.android.gms.games.LeaderboardsClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.playergameevent.PlayerGameEvent;

import org.json.JSONException;
import org.json.JSONObject;
import java.util.Iterator;

@CapacitorPlugin(name = "PGSPlugin")
public class PGSPlugin extends Plugin {

    @SuppressWarnings("unused")
    public void unlockAchievement(PluginCall call) {
        String id = call.getString("id");
        if (id == null) {
            call.reject("Achievement ID is required");
            return;
        }
        AchievementsClient client = PlayGames.getAchievementsClient(getActivity());
        client.unlock(id);
        call.resolve();
    }

    // --- Game Stats ---
    // call.getString("eventName")   e.g. "game_start", "game_win", "progressUpdate"
    // call.getObject("properties")  e.g. { "game_type": "chess" } or { "currentProgress": 3 }
    @SuppressWarnings("unused")
    public void recordGameStatEvent(PluginCall call) {
        String eventName = call.getString("eventName");
        if (eventName == null) {
            call.reject("eventName is required");
            return;
        }

        JSObject properties = call.getObject("properties");
        PlayerGameEvent.Builder builder = new PlayerGameEvent.Builder(eventName);

        if (properties != null) {
            Iterator<String> keys = properties.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object value = properties.opt(key);
                try {
                    if (value instanceof Integer || value instanceof Long) {
                        builder.addProperty(key, ((Number) value).longValue());
                    } else if (value instanceof Double || value instanceof Float) {
                        // PlayerGameEvent properties are String/long/bool per schema;
                        // send doubles as their string form so console-declared
                        // STRING properties still validate.
                        builder.addProperty(key, String.valueOf(value));
                    } else if (value instanceof Boolean) {
                        builder.addProperty(key, (Boolean) value);
                    } else {
                        builder.addProperty(key, String.valueOf(value));
                    }
                } catch (Exception e) {
                    // skip a malformed property rather than failing the whole event
                }
            }
        }

        try {
            GameStatsClient client = PlayGames.getGameStatsClient(getActivity());
            PlayerGameEvent event = builder.build();
            client.recordEvent(event);
            client.requestEventsUpload();
            call.resolve();
        } catch (Exception e) {
            // Never crash the game over a stats hiccup (offline, not signed in, etc.)
            call.reject("recordGameStatEvent failed: " + e.getMessage());
        }
    }

    // --- Leaderboards ---
    // call.getString("leaderboardId")
    // call.getInt("score")  (Play Games scores are 64-bit ints; JS ints up to 2^53 are safe here)
    @SuppressWarnings("unused")
    public void submitScore(PluginCall call) {
        String leaderboardId = call.getString("leaderboardId");
        Integer score = call.getInt("score");
        if (leaderboardId == null || score == null) {
            call.reject("leaderboardId and score are required");
            return;
        }
        try {
            LeaderboardsClient client = PlayGames.getLeaderboardsClient(getActivity());
            client.submitScore(leaderboardId, (long) score);
            call.resolve();
        } catch (Exception e) {
            call.reject("submitScore failed: " + e.getMessage());
        }
    }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  type: "order" | "offer" | "system";
  time: string;  
  read: boolean;
};

export interface NotificationState {
  notifications: NotificationType[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// Fetch All
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async () => {
    const response = await fetch("/api/notification");
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Failed to fetch");
    return result.notification as NotificationType[];
  }
);

// Mark Single
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notification_id: string) => {
    const response = await fetch("/api/notification", {
      method: "PATCH",
      body: JSON.stringify({ notification_id }),
      headers: { "Content-Type": "application/json" },
    });

    await response.json();
    if (!response.ok) throw new Error("Failed to update");

    return notification_id;
  }
);

// Mark All
export const markAllAsRead = createAsyncThunk(
  "notifications/markAll",
  async () => {
    await fetch("/api/notification/mark-all", { method: "PATCH" });
    return true;
  }
);

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setInitialNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications = action.payload;
    },

    pushNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed";
      })

      // mark single
      .addCase(markAsRead.fulfilled, (state, action) => {
        const target = state.notifications.find(n => n.id === action.payload);
        if (target) target.read = true;
      })

      // mark all
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => (n.read = true));
      });
  },
});

export const { pushNotification, setInitialNotifications } =
  notificationSlice.actions;

export const selectUnreadCount = (state: any) =>
  state.notification.notifications.filter((n: NotificationType) => !n.read).length;

export default notificationSlice.reducer;


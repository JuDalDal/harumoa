export const mockUsers = [
    {
      user_id: 1,
      name: "Alice",
      email: "alice@example.com",
      type: 0, // 일반 회원
      password: "hashed_password_1",
      profile_picture: null,
      provider: null,
      provider_id: null,
      access_token: "mock_access_token_1",
      refresh_token: "mock_refresh_token_1",
      expire_time: "2025-03-10T23:59:59Z",
      auto_login_token: null,
      auto_expire_time: null,
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    },
    {
      user_id: 2,
      name: "Bob",
      email: "bob@example.com",
      type: 1, // OAuth 회원
      password: "hashed_password_2",
      profile_picture: "https://example.com/avatar/bob.jpg",
      provider: "google",
      provider_id: "google_123456",
      access_token: "mock_access_token_2",
      refresh_token: "mock_refresh_token_2",
      expire_time: "2025-03-10T23:59:59Z",
      auto_login_token: null,
      auto_expire_time: null,
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    }
  ];
  
  export const mockCategories = [
    {
      category_id: 1,
      user_id: 1,
      name: "Work",
      color: "FF5733",
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    },
    {
      category_id: 2,
      user_id: 1,
      name: "Personal",
      color: "33FF57",
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    }
  ];
  
  export const mockSchedules = [
    {
      schedule_id: 1,
      user_id: 1,
      category_id: 1,
      repeat_id: null,
      title: "Project Deadline",
      start_time: "2025-03-05T10:00:00Z",
      end_time: "2025-03-05T12:00:00Z",
      all_day: 0,
      location: "Office",
      detail: "Complete the final report.",
      alarm: [30],
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    },
    {
      schedule_id: 2,
      user_id: 1,
      category_id: 2,
      repeat_id: null,
      title: "Exercise",
      start_time: "2025-03-05T10:00:00Z",
      end_time: "2025-03-05T12:00:00Z",
      all_day: 0,
      location: "Office",
      detail: "Complete the final report.",
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    }
  ];
  
  export const mockPlans = [
    {
      plan_id: 1,
      user_id: 1,
      type: 3,
      year: 2025,
      month: null,
      week: null,
      day: null,
      title: "Annual Budget Plan",
      completed: 0,
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    }
  ];
  
  export const mockAlarms = [
    {
      alarm_id: 1,
      schedule_id: 1,
      datetime: "2025-03-05T11:30:00Z",
      created_at: "2025-03-01T12:00:00Z"
    }
  ];
  
  export const mockRepeats = [
    {
      repeat_id: 1,
      start_date: "2025-03-01",
      end_date: "2025-06-01",
      type: 2,
      interval_value: 1,
      days_of_week: null,
      created_at: "2025-03-01T12:00:00Z",
      updated_at: "2025-03-02T12:00:00Z"
    }
  ];
  
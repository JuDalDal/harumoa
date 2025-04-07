import { DefaultBodyType, http, HttpResponse } from 'msw'
import { successResponses, errorResponses } from './responses';
import { mockUsers, mockPlans, mockCategories, mockSchedules, mockAlarms } from './mockDatas';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// handlers
export const handlers = [
  // test handler. 추후 삭제합니다.
  http.get('https://localhost:3000/user', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
  // user
  http.post(`${baseUrl}/user/register`, async ({ request }) => {
    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (!('email' in body) || !('password' in body) || !('name' in body)) return errorResponses.BAD_REQUEST;
    if (body.email === "" || body.password === "" || body.name === "") return errorResponses.BAD_REQUEST;

    mockUsers.push({
      user_id: 3,
      name: body.name,
      email: body.email,
      type: 0,
      password: body.password,
      profile_picture: body.profile_picture || null,
      provider: null,
      provider_id: null,
      access_token: "",
      refresh_token: "",
      expire_time: "",
      auto_login_token: null,
      auto_expire_time: null,
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    });

    const user = mockUsers[2];

    return successResponses.USER_CREATED({
      "name": user.name,
      "email": user.email,
      "profile_picture": user.profile_picture,
      "created_at": user.created_at,
    });
  }),

  http.post(`${baseUrl}/user/login`, async ({ request }) => {
    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (!('email' in body) || !('password' in body)) return errorResponses.BAD_REQUEST;
    if (body.email === "" || body.password === "") return errorResponses.BAD_REQUEST;

    return successResponses.USER_LOGIN({access_token: 'access_token', refresh_token: 'refresh_token'});
  }),

  http.post(`${baseUrl}/user/logout`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    // token 삭제 로직
    return successResponses.USER_LOGOUT();
  }),

  http.get(`${baseUrl}/user/me`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;

    const user = mockUsers[0];

    return successResponses.USER_FOUND({
      "name": user.name,
      "email": user.email,
      "profile_picture": user.profile_picture,
      "created_at": user.created_at,
    });
  }),

  http.put(`${baseUrl}/user`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (!('name' in body) || !('profile_picture' in body)) return errorResponses.BAD_REQUEST;
    if (body.email === "" || body.password === "") return errorResponses.BAD_REQUEST;

    const user = mockUsers[0];

    return successResponses.USER_FOUND({
      "name": body.name,
      "email": user.email,
      "profile_picture": body.profile_picture,
      "created_at": user.created_at,
    });
  }),

  http.delete(`${baseUrl}/user`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    // user 삭제 로직
    return successResponses.USER_DELETED();
  }),

  // plan
  http.post(`${baseUrl}/plan`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    const userId = 1;

    const body = await request.json();
    
    const bodyError = verifyPlan(body);
    if (bodyError) return bodyError;

    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    const newPlan = {
      plan_id: 2,
      user_id: userId,
      type: body.type,
      year: body.year,
      month: body.month,
      week: body.week,
      day: body.day,
      title: body.title,
      completed: 0,
      created_at: new Date().toString(),
      updated_at: new Date().toString()}

    mockPlans.push(newPlan);

    return successResponses.PLAN_CREATED(newPlan)
  }),

  http.put(`${baseUrl}/plan/:planId`, async ({ params, request }) => {
    const { planId } = params;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    if (planId === undefined) return errorResponses.PLAN_NOT_FOUND;

    const body = await request.json();

    if (body === undefined || body === null) return errorResponses.BAD_REQUEST;
    let prevPlan: { [key: string]: string | number | null };

    try {
      prevPlan = getPlanWithPlanId(+planId, userId);
    } catch {
      return errorResponses.PLAN_NOT_FOUND;
    }
    
    const bodyError = verifyPlan(body);
    if (bodyError) return bodyError;

    for (const [key, value] of Object.entries(body)) {
      prevPlan[key] = value;
    }
    
    return  successResponses.PLAN_EDITED(prevPlan)
  }),

  http.delete(`${baseUrl}/plan/:planId`, async({ params, request }) => {
    const { planId } = params;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    if (planId === undefined) return errorResponses.PLAN_NOT_FOUND;

    try {
      getPlanWithPlanId(+planId, userId);
    } catch {
      return errorResponses.PLAN_NOT_FOUND;
    }

    return successResponses.PLAN_DELETED();
  }),

  http.get(`${baseUrl}/plan`, async ({ request }) => {
    const userId = 1;
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');
    const week = url.searchParams.get('week');
    const day = url.searchParams.get('day');

    if (year && !month && !week && !day) {
     // year 조회
     let result;
     try {
      result = getPlanWithType(userId, 3, +year)
     } catch {
      return errorResponses.BAD_REQUEST;
     }
     return successResponses.PLAN_FOUND(result);
    }

    if (year && month && !week && !day) {
      // month 조회
      let result;
      try {
      result = getPlanWithType(userId, 2, +year, +month)
      } catch {
      return errorResponses.BAD_REQUEST;
      }
      return successResponses.PLAN_FOUND(result);
    }

    if (year && month && week && !day) {
      // week 조회
      let result;
      try {
        result = getPlanWithType(userId, 1, +year, +month, +week)
      } catch {
        return errorResponses.BAD_REQUEST;
      }
      return successResponses.PLAN_FOUND(result);
    }

    if (year && month && !week && day) {
      // day 조회
      let result;
      try {
        result = getPlanWithType(userId, 0, +year, +month, +day)
      } catch {
        return errorResponses.BAD_REQUEST;
      }
      return successResponses.PLAN_FOUND(result);
    }

    return errorResponses.BAD_REQUEST;
  }),

  // category
  http.post(`${baseUrl}/category`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    const userId = 1;

    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (!('name' in body) || !('color' in body)) return errorResponses.BAD_REQUEST;
    if (body.name === "" || body.color === "") return errorResponses.BAD_REQUEST;

    const newCategory = {
      category_id: 3,
      user_id: userId,
      name: body.name,
      color: body.color,
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    }

    mockCategories.push(newCategory);

    return successResponses.CATEGORY_CREATED({
      category_id: newCategory.category_id,
      name: newCategory.name,
      color: newCategory.color,
    });
  }),

  http.put(`${baseUrl}/category/:categoryId`, async ({ params, request }) => {
    const { categoryId } = params;
    if (categoryId === undefined) return errorResponses.CATEGORY_NOT_FOUND;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (!('name' in body) || !('color' in body)) return errorResponses.BAD_REQUEST;
    if (body.name === "" || body.color === "") return errorResponses.BAD_REQUEST;

    const prevCategory = mockCategories.filter(v => v.category_id === +categoryId && v.user_id === userId);
    prevCategory[0].name = body.name;
    prevCategory[0].color = body.color;
    prevCategory[0].updated_at = new Date().toString();
  
    return successResponses.CATEGORY_EDITED({
      category_id: prevCategory[0].category_id,
      name: prevCategory[0].name,
      color: prevCategory[0].color,
    });
  }),

  http.delete(`${baseUrl}/category/:categoryId`, async ({ params, request }) => {
    const { categoryId } = params;
    if (categoryId === undefined) return errorResponses.CATEGORY_NOT_FOUND;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    const idx = mockCategories.findIndex(v => v.category_id === +categoryId && v.user_id === userId);
    if (idx === -1) return errorResponses.CATEGORY_NOT_FOUND;
    mockCategories.splice(idx, 1);

    return successResponses.CATEGORY_DELETED();
  }),

  http.get(`${baseUrl}/category`, async ({ request }) => {
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    const categories = mockCategories.filter(v => v.user_id === userId).map(v => ({
      "category_id": v.category_id,
      "name": v.name,
      "color": v.color,
      "created_at": v.created_at,
    }));

    return successResponses.CATEGORY_FOUND(categories);
  }),

  // schedule
  http.post(`${baseUrl}/schedule`, async ({ request }) => {
    const authError = verifyAuth(request);
    if (authError) return authError;
    const userId = 1;

    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (
      !('category_id' in body) ||
      !('title' in body) ||
      !('start_datetime' in body) ||
      !('end_datetime' in body) ||
      !('all_day' in body) ||
      !('location' in body) ||
      !('detail' in body) ||
      !('alarm' in body)
    ) return errorResponses.BAD_REQUEST;

    if (
      body.category_id === null ||
      body.title === "" ||
      body.all_day == 0 && (body.start_datetime === "" || body.end_datetime === "") ||
      body.location === "" ||
      body.detail === "") return errorResponses.BAD_REQUEST;
    
    const newSchedule = {
      schedule_id: 3,
      user_id: userId,
      category_id: body.category_id,
      repeat_id: null,
      title: body.title,
      start_time: body.start_time,
      end_time: body.end_time,
      all_day: body.all_day,
      location: body.location,
      detail: body.detail,
      alarm: body.alarm,
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    }

    mockSchedules.push(newSchedule);

    const time = new Date(newSchedule.start_time);
    time.setMinutes(time.getMinutes() - body.alarm);

    if (body.alarm !== null && body.alarm.length > 0) {
      mockAlarms.push({
        alarm_id: 2,
        schedule_id: newSchedule.schedule_id,
        datetime: time.toString(),
        created_at: new Date().toString(),
      })
    }

    return successResponses.SCHEDULE_CREATED({
      schedule_id: newSchedule.schedule_id,
      category_id: newSchedule.category_id,
      title: newSchedule.title,
      start_time: newSchedule.start_time,
      end_time: newSchedule.end_time,
      all_day: newSchedule.all_day,
      location: newSchedule.location,
      detail: newSchedule.detail,
      alarm: JSON.stringify(mockAlarms.filter(v => v.schedule_id === newSchedule.schedule_id).map(v => v.alarm_id)),
    });
  }),
  
  http.put(`${baseUrl}/schedule/:scheduleId`, async ({ params, request }) => {
    const { scheduleId } = params;
    if (scheduleId === undefined) return errorResponses.SCHEDULE_NOT_FOUND;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    const body = await request.json();
    if (typeof body !== 'object' || body === null) return errorResponses.BAD_REQUEST;
    if (
      !('category_id' in body) ||
      !('title' in body) ||
      !('start_datetime' in body) ||
      !('end_datetime' in body) ||
      !('all_day' in body) ||
      !('location' in body) ||
      !('detail' in body) ||
      !('alarm' in body) ||
      !('delete_id' in body.alarm) ||
      !('add' in body.alarm)
    ) return errorResponses.BAD_REQUEST;

    if (
      body.category_id === null ||
      body.title === "" ||
      body.all_day == 0 && (body.start_datetime === "" || body.end_datetime === "") ||
      body.location === "" ||
      body.detail === "" || body.alarm === undefined) return errorResponses.BAD_REQUEST;

    const idx = mockSchedules.findIndex(v => v.schedule_id === +scheduleId && v.user_id === userId);
    if (idx === -1) return errorResponses.SCHEDULE_NOT_FOUND;
    mockSchedules[idx].category_id = body.category_id;
    mockSchedules[idx].title = body.title;
    mockSchedules[idx].start_time = body.start_time;
    mockSchedules[idx].end_time = body.end_time;
    mockSchedules[idx].all_day = body.all_day;
    mockSchedules[idx].location = body.location;
    mockSchedules[idx].detail = body.detail;
    mockSchedules[idx].alarm = body.alarm;
    mockSchedules[idx].updated_at = new Date().toString();

    // alarm 삭제, 추가 로직
    const deleteIds = body.alarm.delete_id;
    
    if (deleteIds !== undefined && deleteIds.length > 0) {
      deleteIds.forEach((v: number) => {
        const alarmIdx = mockAlarms.findIndex(a => a.alarm_id === v);
        if (alarmIdx !== -1) mockAlarms.splice(alarmIdx, 1);
      });
    }
    if (body.alarm.add !== undefined && body.alarm.add.length > 0) {
      body.alarm.add.forEach((v: number) => {
        const time = new Date(mockSchedules[idx].start_time);
        time.setMinutes(time.getMinutes() - v);
        mockAlarms.push({
          alarm_id: 2,
          schedule_id: mockSchedules[idx].schedule_id,
          datetime: time.toString(),
          created_at: new Date().toString(),
        });
      });
    }

    return successResponses.SCHEDULE_EDITED({
      schedule_id: mockSchedules[idx].schedule_id,
      category_id: mockSchedules[idx].category_id,
      title: mockSchedules[idx].title,
      start_time: mockSchedules[idx].start_time,
      end_time: mockSchedules[idx].end_time,
      all_day: mockSchedules[idx].all_day,
      location: mockSchedules[idx].location,
      detail: mockSchedules[idx].detail,
      alarm: mockSchedules[idx].alarm ? JSON.stringify(mockSchedules[idx].alarm) : null,
    });
  }),

  http.delete(`${baseUrl}/schedule/:scheduleId`, async ({ params, request }) => {
    const { scheduleId } = params;
    if (scheduleId === undefined) return errorResponses.SCHEDULE_NOT_FOUND;
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;

    const idx = mockSchedules.findIndex(v => v.schedule_id === +scheduleId && v.user_id === userId);
    if (idx === -1) return errorResponses.SCHEDULE_NOT_FOUND;
    mockSchedules.splice(idx, 1);

    return successResponses.SCHEDULE_DELETED();
  }),

  http.get(`${baseUrl}/schedule`, async ({ request }) => {
    const userId = 1;
    const authError = verifyAuth(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');
    const week = url.searchParams.get('week');
    const day = url.searchParams.get('day');

    if (year && month && !week && !day) {
      // month 조회
      const result = mockSchedules.filter(v => {
        const startDate = new Date(v.start_time);
        return v.user_id === userId && startDate.getFullYear() === +year && startDate.getMonth() + 1 === +month;
      });
      return successResponses.SCHEDULE_FOUND(result.map(v => ({
        schedule_id: v.schedule_id,
        category_id: v.category_id,
        title: v.title,
        start_time: v.start_time,
        end_time: v.end_time,
        all_day: v.all_day,
        location: v.location,
      })));
    }

    if (year && month && week && !day) {
      // week 조회
      const result = mockSchedules.filter(v => {
        const startDate = new Date(v.start_time);
        return v.user_id === userId && startDate.getFullYear() === +year && startDate.getMonth() + 1 === +month && getWeek(startDate) === +week;
      });
      return successResponses.SCHEDULE_FOUND(result.map(v => ({
        schedule_id: v.schedule_id,
        category_id: v.category_id,
        title: v.title,
        start_time: v.start_time,
        end_time: v.end_time,
        all_day: v.all_day,
        location: v.location,
      })));
    }

    if (year && month && !week && day) {
      // day 조회
      const result = mockSchedules.filter(v => {
        const startDate = new Date(v.start_time);
        return v.user_id === userId && startDate.getFullYear() === +year && startDate.getMonth() + 1 === +month && startDate.getDate() === +day;
      });
      return successResponses.SCHEDULE_FOUND(result.map(v => ({
        schedule_id: v.schedule_id,
        category_id: v.category_id,
        title: v.title,
        start_time: v.start_time,
        end_time: v.end_time,
        all_day: v.all_day,
        location: v.location,
      })));
    }

    return errorResponses.BAD_REQUEST;
  }),
]

// access_token 확인 함수 (추후 수정)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function verifyAuth(request: Request) {
  // const authHeader = request.headers.get('Authorization');

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return errorResponses.UNAUTHORIZED;
  // }

  return null;
}

// plan post body 확인 함수
function verifyPlan(body: DefaultBodyType): HttpResponse | null {
  if (body == null || typeof body !== 'object' || !('title' in body) || body.title === "") return errorResponses.BAD_REQUEST;

  switch (body.type) {
    case undefined:
      return errorResponses.BAD_REQUEST;
    case 3:
      if (!('year' in body) || body.year == null) return errorResponses.BAD_REQUEST;
      break;
    case 2:
      if (!('year' in body) || !('month' in body) || body.year == null || body.month == null) return errorResponses.BAD_REQUEST;
      break;
    case 1:
      if (body.year == null || body.month == null || body.week == null || body.day == null) {
        return errorResponses.BAD_REQUEST;
      }
      break;
  }

  return null;
}

// plan Id 조회 함수
function getPlanWithPlanId(planId: number, userId: number): { [key: string]: string | number | null }{
  const result = mockPlans.filter(v => v.plan_id === planId && v.user_id === userId);
  if (result.length === 0) throw new Error;
  else return result[0];
}

function getPlanWithType(
  userId: number,
  type: number,
  year: number,
  month?: number,
  week?: number,
  day?: number
):{ [key: string]: string | number | null }[] {
  if (
    type > 3 ||
    type === 0 && (!year || !month || !day) ||
    type === 1 && (!year || !month || !week) ||
    type === 2 && (!year || !month) ||
    type === 3 && !year
  ) throw new Error;

  if (type === 0) {
    return mockPlans
          .filter(v => v.user_id === userId && v.year === year && v.month === month && v.day === day)
          .map(v => ({
            plan_id: v.plan_id,
            type: v.type,
            year: v.year,
            month: v.month,
            day: v.day,
            title: v.title,
            completed: v.completed,
            created_at: v.created_at 
          }));
  }

  if (type === 1) {
    return mockPlans
          .filter(v => v.user_id === userId && v.year === year && v.month === month && v.week === week)
          .map(v => ({
            plan_id: v.plan_id,
            type: v.type,
            year: v.year,
            month: v.month,
            week: v.week,
            title: v.title,
            completed: v.completed,
            created_at: v.created_at 
          }));
  }

  if (type === 2) {
    return mockPlans
          .filter(v => v.user_id === userId && v.year === year && v.month === month)
          .map(v => ({
            plan_id: v.plan_id,
            type: v.type,
            year: v.year,
            month: v.month,
            title: v.title,
            completed: v.completed,
            created_at: v.created_at 
          }));
  }

  if (type === 3) {
    return mockPlans
          .filter(v => v.user_id === userId && v.year === year)
          .map(v => ({
            plan_id: v.plan_id,
            type: v.type,
            year: v.year,
            title: v.title,
            completed: v.completed,
            created_at: v.created_at 
          }));
  }

  throw new Error;
}

function getWeek(date: Date) {
  const onejan = new Date(date.getFullYear(),0,1);
  const today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const dayOfYear = (((today.getTime() - onejan.getTime()) + 86400000) / 86400000);
  return Math.ceil(dayOfYear/7)
};
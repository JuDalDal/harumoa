import { DefaultBodyType, http, HttpResponse } from 'msw'
import { successResponses, errorResponses } from './responses';
import { mockPlans } from './mockDatas';

const baseUrl = 'https://localhost:3000/api';

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
  })
  
  // schedule
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
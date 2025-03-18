import { HttpResponse } from "msw";

// 성공 응답은 함수 형식으로 data object 삽입하여 사용
export const successResponses = {
    USER_CREATED: (data: Record<string, string | number | null>) => generateResponse(201, "USER_CREATED", data),
    PLAN_CREATED: (data: Record<string, string | number | null>) => generateResponse(201, "PLAN_CREATED", data),
    SCHEDULE_CREATED: (data: Record<string, string | number | null>) => generateResponse(201, "SCHEDULE_CREATED", data),
    CATEGORY_CREATED: (data: Record<string, string | number | null>) => generateResponse(201, "CATEGORY_CREATED", data),
    USER_LOGIN: (cookies: Record<string, string>) => generateResponse(200, "USER_CREATED", undefined, cookies),
    USER_FOUND: (data: Record<string, string | number | null>) => generateResponse(200, "USER_FOUND", data),
    USER_EDITED: (data: Record<string, string | number | null>) => generateResponse(200, "USER_EDITED", data),
    USER_DELETED: () => generateResponse(200, "USER_DELETED"),
    PLAN_FOUND: (data: Record<string, string | number | null>[]) => generateResponse(200, "PLAN_FOUND", data),
    PLAN_EDITED: (data: Record<string, string | number | null>) => generateResponse(200, "PLAN_EDITED", data),
    PLAN_DELETED: () => generateResponse(200, "PLAN_DELETED"),
    SCHEDULE_FOUND: (data: Record<string, string | number | null>[]) => generateResponse(200, "USER_FOUND", data),
    SCHEDULE_EDITED: (data: Record<string, string | number | null>) => generateResponse(200, "USER_EDITED", data),
    SCHEDULE_DELETED: () => generateResponse(200, "USER_DELETED"),
    CATEGORY_FOUND: (data: Record<string, string | number | null>[]) => generateResponse(200, "USER_FOUND", data),
    CATEGORY_EDITED: (data: Record<string, string | number | null>) => generateResponse(200, "USER_EDITED", data),
    CATEGORY_DELETED: () => generateResponse(200, "USER_DELETED"),
}

// 에러 응답은 HttpResponse 형식으로 바로 사용
export const errorResponses = {
    BAD_REQUEST: generateResponse(400, "BAD_REQUEST"),
    UNAUTHORIZED: generateResponse(401, "UNAUTHORIZED"),
    USER_EMAIL_NOT_FOUND: generateResponse(404, "USER_EMAIL_NOT_FOUND"),
    USER_PASSWORD_INCORRECT: generateResponse(404, "USER_PASSWORD_INCORRECT"),
    USER_NOT_FOUND: generateResponse(404, "USER_NOT_FOUND"),
    PLAN_NOT_FOUND: generateResponse(404, "PLAN_NOT_FOUND"),
    SCHEDULE_NOT_FOUND: generateResponse(404, "SCHEDULE_NOT_FOUND"),
    CATEGORY_NOT_FOUND: generateResponse(404, "CATEGORY_NOT_FOUND"),
    USER_EMAIL_CONFLICT: generateResponse(409, "USER_EMAIL_CONFLICT"),
    CATEGORY_NAME_CONFLICT: generateResponse(409, "CATEGORY_NAME_CONFLICT"),
    INTERNAL_SERVER_ERROR: generateResponse(500, "INTERNAL_SERVER_ERROR")
}

function generateResponse(
    httpStatus: number,
    code: string,
    data?: Record<string, string | number | null> | Record<string, string | number | null>[],
    cookies?: Record<string, string>
): HttpResponse {
    const res = new HttpResponse(
        JSON.stringify({
        status: httpStatus === 200 || httpStatus === 201 ? "success": "error",
        httpStatus,
        code,
        data
        }),
        {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json' }
        }
    )

    if (cookies) {
        const cookieHeader = Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
        res.headers.set('Set-Cookie', cookieHeader);
    }

    return res;
}
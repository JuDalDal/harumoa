// 서버 환경 setupServer 생성
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
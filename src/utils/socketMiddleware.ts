import { TWSTypes } from './types/actions/WSTypes';
import { TWsActions } from './types/actions/WSTypes';
import type { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from './types/types';
import { getCookie } from './cookie';

export const socketMiddleware = (wsUrl: string, wsActions: TWsActions): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return next => (action: TWSTypes) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const { wsInit, onOpen, onClose, onError, onMessage } = wsActions;

      if (type === wsInit && payload.toString().includes(`${getCookie('token')}`)) {
        socket = new WebSocket(
          `${wsUrl}?token=${getCookie('token')
            ?.split("Bearer ")
            .join("")}`
        );
      } else if (type === wsInit) {
        const endpoint = payload;
        socket = new WebSocket(`${wsUrl}${endpoint}`);
      }

      if (socket) {
        // функция, которая вызывается при открытии сокета
        socket.onopen = () => {
          // console.log('ws open');
          dispatch({ type: onOpen });
        };

        // функция, которая вызывается при ошибке соединения
        socket.onerror = () => {
          // console.log('ws error');
          dispatch({ type: onError });
        };

        // функция, которая вызывается при получения события от сервера
        socket.onmessage = event => {
          // console.log('ws data transfer');
          const { data } = event;
          const parsedData = JSON.parse(data);
          const { success, ...restParsedData } = parsedData;
          dispatch({ type: onMessage, responseData: restParsedData });
        };
        if (onClose && type === onClose && socket) {
          // console.log('ws closed');
          socket.close();

          socket = null;
          dispatch({ type: onClose });
        }
      }
      next(action);
    };
  }) as Middleware;
}



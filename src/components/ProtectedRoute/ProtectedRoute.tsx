import { FC } from 'react';
import { useSelector } from '../../services/hooks';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { TUserState } from '../../utils/types/types';

export const ProtectedRoute: FC<RouteProps> = ({ children, path, ...rest }) => {
  const { isLoggedIn, loggingIn } = useSelector((state): TUserState => state.user);

  return (
    <>
      {
        !loggingIn
          ?
          <Route
            {...rest}
            // Получим текущий маршрут, с которого произойдёт переадресация
            // для неавторизованного пользователя
            render={({ location }) =>
              isLoggedIn
                ?
                (
                  children
                ) : (
                  <Redirect
                    // Передадим в пропс to не строку, а объект.
                    to={{
                      // Маршрут, на который произойдёт переадресация
                      pathname: '/login',
                      // В from сохраним текущий маршрут
                      state: { from: location }
                    }}
                  />
                )
            }
          />
          :
          <Route
            {...rest}
            // Получим текущий маршрут, с которого произойдёт переадресация
            // для неавторизованного пользователя
            render={({ location }) =>
              <Redirect
                // Передадим в пропс to не строку, а объект.
                to={{
                  // Маршрут, на который произойдёт переадресация
                  pathname: '/login',
                  // В from сохраним текущий маршрут
                  state: { from: location }
                }}
              />
            }
          />
      }
    </>
  )
}
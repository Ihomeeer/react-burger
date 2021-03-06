import React, { FC } from 'react';
import { OrderFeed } from '../../components/OrderFeed/OrderFeed';
import { WSConnectionStartAction, WSConnectionClosedAction } from '../../services/actions/wsActions';
import { useDispatch, useSelector } from '../../services/hooks';
import { TWSState } from '../../utils/types/reducers/WSReducerTypes';
import { getCookie } from '../../utils/cookie';

export const PersonalFeed: FC = () => {
  const dispatch = useDispatch();

  const { responseData } = useSelector(
    (state): TWSState => state.ws
  );

  React.useEffect(() => {
    dispatch(WSConnectionStartAction(getCookie('token') as string));
    return () => {
      dispatch(WSConnectionClosedAction())
    }
  }, [dispatch])

  return (
    <>
      {
        responseData &&
        <OrderFeed
          data={responseData.orders}
          pathname='orders/'
          isFeed={false}
        />
      }
    </>
  )
}
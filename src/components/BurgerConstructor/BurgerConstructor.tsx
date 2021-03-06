// Конструктор бургеров (правый который)
import React, { FC } from 'react';
import styles from './BurgerConstructor.module.css';
import BurgerConstructorItem from "../BurgerConstructorItem/BurgerConstructorItem";
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from '../../services/hooks';
import { useHistory } from 'react-router-dom';
// import { DRAG_ARRAY, INCREASE_COUNTER } from '../../utils/constants';
import { addItemAction, increaseCounterAction, setBunAction, dragArrayAction } from '../../services/actions/allIngredients';
import { useDrop } from 'react-dnd';
import { v4 as generateUid } from 'uuid';
import { TBurgerConstructor, TConstructorIngredient, TBurgerConstructorItem, TBaseIngredient, TBurgerConstructorState, TUserState } from '../../utils/types/types';



const BurgerConstructor: FC<TBurgerConstructor> = ({ openModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector(
    (state): TBurgerConstructorState => state.burgerConstructor
  );
  const { isLoggedIn } = useSelector(
    (state): TUserState => state.user
  );

  // контейнер для приема ингредиентов
  const [{ canDrop }, dropTarget] = useDrop({
    accept: "ingredient",
    drop(item: TBurgerConstructorItem) {
      onDropHandler(item);
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
    })
  });

  // обработка перетаскивания ингредиента в конструктор
  function onDropHandler(ingredient: TBurgerConstructorItem) {
    const { item }: TBurgerConstructorItem = ingredient;
    if (item && !item.uid) {
      if (item.type !== 'bun') {
        const newItem = { ...item }
        newItem.uid = generateUid();
        dispatch(addItemAction(newItem))
        dispatch(increaseCounterAction(item))
      } else {
        dispatch(setBunAction(item))
        dispatch(increaseCounterAction(item))
      }
    }
  }

  // Вот тут стоимость считается
  const totalPrice = React.useMemo(() => {
    if (ingredients && bun) {
      const priceMain: number = ingredients && ingredients?.reduce((prevPrice: number, item: TConstructorIngredient) => prevPrice + item.price, 0)
      const priceWithBuns = priceMain + bun.price * 2;
      return priceWithBuns
    } else {
      return 0
    }
  }, [ingredients, bun])

  // Формирование массива Id'ов и отправка на сервер, открытие модалки с номером заказа
  const submitOrder = () => {
    const idArray: string[] = [bun._id, ...ingredients.map((item: TConstructorIngredient) => item._id), bun._id];
    if (isLoggedIn) {
      ingredients && openModal(idArray)
    } else {
      history.replace({ pathname: '/login' })
    }
  }

  // обработка тасовки ингредиентов в конструкторе
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem: TBaseIngredient = ingredients[dragIndex];
    if (draggedItem && draggedItem.type !== "bun") {
      const modifiedItems = [...ingredients];
      modifiedItems.splice(dragIndex, 1);
      modifiedItems.splice(hoverIndex, 0, draggedItem);
      dispatch(dragArrayAction(modifiedItems))
    } else {
      return
    }
  };

  return (
    <section className={`${styles.section} ml-10 pt-25`}>
      <div className={`${styles.listContainer} ${canDrop && styles.listContainerRecept}`} ref={dropTarget}>
        {bun && <BurgerConstructorItem
          item={bun}
          moveItem={moveItem}
          isTop
          isLocked
        />}

        <ul className={styles.list} >
          {ingredients && ingredients?.map((item: TConstructorIngredient, index: number) => {
            return (
              <li key={item.uid} className={styles.listItem}>
                <BurgerConstructorItem
                  item={item}
                  index={index}
                  moveItem={moveItem}
                />
              </li>
            )
          })}
        </ul>

        {bun && <BurgerConstructorItem
          item={bun}
          moveItem={moveItem}
          isBottom
          isLocked
        />}
      </div>
      <div className={`${styles.lowerPanel} mt-10 mr-4`}>
        <p className="text text_type_main-large mr-2">{totalPrice}</p>
        <CurrencyIcon type="primary" />
        <Button type="primary" size="medium" onClick={submitOrder} disabled={bun ? false : true}>
          Оформить заказ
        </Button>
      </div>
    </section>
  )
}

export default BurgerConstructor;
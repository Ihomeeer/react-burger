import React from 'react';
import styles from './RegisterPage.module.css';
import { Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { register } from '../../services/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { CLEAR_REGISTRATION_STATE } from '../../services/actions/user';
import EnteringForm from '../../components/EnteringForm/EnteringForm';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();
  const { register_success } = useSelector(
    state => state.user
  );

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const clearState = () => {
    setEmail('');
    setName('');
    setPassword('');
  }

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password));
    clearState();
  }

  React.useEffect(() => {
    if (register_success) {
      history.replace({pathname: '/login'})
      dispatch({ type: CLEAR_REGISTRATION_STATE })
    }
  }, [history, register_success])

  return (
    <section className={styles.section}>
      <EnteringForm
        formTitle="Регистрация"
        buttonTitle="Зарегистрироваться"
        onSubmit={onSubmit}
      >
        <Input
          type="text"
          name="name"
          size="default"
          placeholder="Имя"
          value={name}
          onChange={handleNameChange}
        />
        <div className="mt-6 mb-6">
          <Input
            type="email"
            name="email"
            size="default"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mt-6 mb-6">
          <Input
            type="password"
            name="password"
            size="default"
            icon="ShowIcon"
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
      </EnteringForm>
    </section>
  )
}

export default RegisterPage;
import { call, getContext, put, takeLatest } from 'redux-saga/effects';
import { fetchUsers, setUsers, deleteUser, userDeleted } from './actions';

function* fetchUsersHandler(logger, { payload: { resolver } }: ReturnType<typeof fetchUsers>) {
  try {
    const services = yield getContext('services');
    const { data: { users } } = yield call(services.users.fetchUsers);

    yield put(setUsers({
      users
    }));
  } catch (error) {
    logger.error(error);
  }
  resolver();
}

function* deleteUserHandler(logger, { payload: { id } }: ReturnType<typeof userDeleted>) {
  try {
    const services = yield getContext('services');
    yield call(() => services.users.deleteUser(id));

    yield put(userDeleted({ id }));
  } catch (error) {
    logger.error(error);
  }
}

function* usersSaga(logger): IterableIterator<unknown> {
  yield takeLatest(fetchUsers.type, fetchUsersHandler, logger);
}

function* deleteUserSaga(logger): IterableIterator<unknown> {
  yield takeLatest(deleteUser.type, deleteUserHandler, logger);
}

export { usersSaga, deleteUserSaga };

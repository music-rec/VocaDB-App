import { createStore, applyMiddleware } from 'redux'
import rootReducers from './appReducer'
// import loggerMiddleware from 'redux-logger'
import { navMiddleware } from './AppWithNavigationState'
import createSagaMiddleware from 'redux-saga'
import saga from './appSagas'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['nav'],
}

const persistedReducer = persistReducer(persistConfig, rootReducers)

const sagaMiddleware = createSagaMiddleware()


export default () => {
    let store = createStore(
        persistedReducer,
        applyMiddleware(
            // loggerMiddleware,
            navMiddleware,
            sagaMiddleware)
    )
    let persistor = persistStore(store)

    sagaMiddleware.run(saga)

    return { store, persistor }
}

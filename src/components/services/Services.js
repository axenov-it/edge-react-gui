// @flow

import { makeReactNativeDisklet } from 'disklet'
import { type EdgeContext } from 'edge-core-js/types'
import * as React from 'react'
import { MenuProvider } from 'react-native-popup-menu'
import { Provider } from 'react-redux'
import { type Middleware, type Store, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'

import ENV from '../../../env.json'
import { loadDeviceReferral } from '../../actions/DeviceReferralActions.js'
import { rootReducer } from '../../reducers/RootReducer.js'
import { type Action } from '../../types/reduxActions.js'
import { type Dispatch, type RootState } from '../../types/reduxTypes.js'
import { errorAlert } from '../../util/middleware/errorAlert.js'
import { loginStatusChecker } from '../../util/middleware/loginStatusChecker.js'
import { perfLogger } from '../../util/middleware/perfLogger.js'
import { ModalProvider } from '../common/ModalProvider.js'
import { Main } from '../Main.ui.js'
import { Airship } from './AirshipInstance.js'
import { AutoLogout } from './AutoLogout.js'
import { ContactsLoader } from './ContactsLoader.js'
import { DeepLinkingManager } from './DeepLinkingManager.js'
import EdgeAccountCallbackManager from './EdgeAccountCallbackManager.js'
import EdgeContextCallbackManager from './EdgeContextCallbackManager.js'
import EdgeWalletsCallbackManager from './EdgeWalletsCallbackManager.js'
import { NetworkActivity } from './NetworkActivity.js'
import { PasswordReminderService } from './PasswordReminderService.js'
import { PermissionsManager } from './PermissionsManager.js'
import { WalletLifecycle } from './WalletLifecycle.js'
type Props = { context: EdgeContext }

/**
 * Provides various global services to the application,
 * including the Redux store, pop-up menus, modals, etc.
 */
export class Services extends React.PureComponent<Props> {
  store: Store<RootState, Action>

  constructor(props: Props) {
    super(props)

    const middleware: Middleware<RootState, Action>[] = [errorAlert, loginStatusChecker, thunk]
    if (ENV.ENABLE_REDUX_PERF_LOGGING) middleware.push(perfLogger)

    if (global.__DEV__) {
      const createDebugger = require('redux-flipper').default
      middleware.push(createDebugger())
    }

    const initialState: $Shape<RootState> = {}

    const composeEnhancers = composeWithDevTools({
      realtime: true,
      name: 'Your Instance Name',
      hostname: 'localhost',
      port: 8000 // the port your remotedev server is running at
    })

    this.store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)))

    if (global.__DEV__) {
      import('../../../ReactotronConfig').then(() => console.log('Reactotron Configured'))
    }

    // Put the context into Redux:
    const { context } = props
    const disklet = makeReactNativeDisklet()
    this.store.dispatch({
      type: 'CORE/CONTEXT/ADD_CONTEXT',
      data: { context, disklet }
    })
  }

  componentDidMount() {
    const dispatch: Dispatch = this.store.dispatch
    dispatch(loadDeviceReferral())
  }

  renderGui() {
    return (
      <MenuProvider>
        <Main />
        <Airship avoidAndroidKeyboard statusBarTranslucent />
      </MenuProvider>
    )
  }

  render() {
    global.ST = this.store.getState

    return (
      <Provider store={this.store}>
        <>
          {this.renderGui()}
          <AutoLogout />
          <ContactsLoader />
          <DeepLinkingManager />
          <EdgeAccountCallbackManager />
          <EdgeContextCallbackManager />
          <EdgeWalletsCallbackManager />
          <ModalProvider />
          <PermissionsManager />
          <NetworkActivity />
          <PasswordReminderService />
          <WalletLifecycle />
        </>
      </Provider>
    )
  }
}

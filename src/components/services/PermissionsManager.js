// @flow

import * as React from 'react'
import { AppState, Platform } from 'react-native'
import { check, checkMultiple, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { connect } from 'react-redux'

import { type Permission, type PermissionsState, type PermissionStatus } from '../../reducers/PermissionsReducer.js'
import { type Dispatch, type RootState } from '../../types/reduxTypes.js'
import { ContactsPermissionModal } from '../modals/ContactsPermissionModal.js'
import { Airship, showError } from './AirshipInstance.js'

const PLATFORM = {
  ios: 'IOS',
  android: 'ANDROID'
}

const OS = PLATFORM[Platform.OS]

const LOCATION = {
  IOS: 'LOCATION_WHEN_IN_USE',
  ANDROID: 'ACCESS_FINE_LOCATION'
}

const CONTACTS = {
  IOS: 'CONTACTS',
  ANDROID: 'READ_CONTACTS'
}

const PERMISSIONS_ITEM = {
  camera: 'CAMERA',
  contacts: CONTACTS[OS],
  location: LOCATION[OS]
}

type StateProps = {
  permissions: PermissionsState
}

type DispatchProps = {
  updatePermissions(permissions: PermissionsState): void
}

type Props = StateProps & DispatchProps

class PermissionsManagerComponent extends React.Component<Props> {
  render() {
    return null
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)

    this.checkPermissions().catch(showError)
  }

  handleAppStateChange = (nextAppState: string) => {
    console.log('State Change => ', nextAppState)

    if (nextAppState === 'active') {
      this.checkPermissions().catch(showError)
    }
  }

  async checkPermissions() {
    const statePermissions = this.props.permissions
    const names = Object.keys(statePermissions)
    const permissions = names.map(name => PERMISSIONS[OS][PERMISSIONS_ITEM[name]])
    const response: PermissionsState = await checkMultiple(permissions)

    // Figure out which ones have changed to avoid a pointless dispatch:
    const newPermissions: PermissionsState = {}
    for (const name of names) {
      const responsePermission = PERMISSIONS[OS][PERMISSIONS_ITEM[name]]
      if (response[responsePermission] !== statePermissions[name]) {
        newPermissions[name] = response[responsePermission]
      }
    }

    if (Object.keys(newPermissions).length > 0) {
      console.log('Permissions updated')
      this.props.updatePermissions(newPermissions)
    } else {
      console.log('Permissions unchanged')
    }
  }
}

export async function requestPermission(data: Permission): Promise<PermissionStatus> {
  const status: PermissionStatus = await check(PERMISSIONS[OS][PERMISSIONS_ITEM[data]])
  if (status === RESULTS.DENIED) {
    if (data === 'contacts') {
      await Airship.show(bridge => <ContactsPermissionModal bridge={bridge} />)
    }
    return request(PERMISSIONS[OS][PERMISSIONS_ITEM[data]])
  }
  return status
}

export const PermissionsManager = connect(
  (state: RootState): StateProps => ({
    permissions: state.permissions
  }),
  (dispatch: Dispatch): DispatchProps => ({
    updatePermissions(permissions: PermissionsState) {
      dispatch({ type: 'PERMISSIONS/UPDATE', data: permissions })
    }
  })
)(PermissionsManagerComponent)

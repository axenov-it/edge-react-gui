// @flow

import React, {Component} from 'react'
import {View} from 'react-native'
import {ChangePasswordScreen} from 'airbitz-core-js-ui'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'
import styles from '../Settings/style.js'
import type {AbcContext, AbcAccount} from 'airbitz-core-types'

export type ChangePasswordOwnProps = {
  onComplete: Function,
  account: AbcAccount,
  context: AbcContext,
  showHeader: boolean
}

export type ChangePasswordDispatchProps = {
  onComplete: () => void
}

export type ChangePasswordStateProps = {
  context: AbcContext,
  account: AbcAccount,
  showHeader: boolean
}

type ChangePasswordComponent = ChangePasswordOwnProps & ChangePasswordDispatchProps & ChangePasswordStateProps

export default class ChangePassword extends Component<ChangePasswordOwnProps> {
  onComplete = () => {
    this.props.onComplete()
  }

  render () {
    return (
      <SafeAreaView>
        <Gradient style={styles.gradient} />
        <View style={styles.container}>
          <ChangePasswordScreen
            account={this.props.account}
            context={this.props.context}
            onComplete={this.onComplete}
            onCancel={this.onComplete}
            showHeader={this.props.showHeader}
          />
        </View>
      </SafeAreaView>
    )
  }
}

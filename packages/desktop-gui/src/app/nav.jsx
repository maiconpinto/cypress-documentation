import { observer } from 'mobx-react'
import React, { Component } from 'react'

import appApi from '../lib/app-api'
import appStore from '../lib/app-store'
import authStore from '../lib/auth-store'
import viewStore from '../lib/view-store'
import ipc from '../lib/ipc'
import { gravatarUrl } from '../lib/utils'
import { Link, routes } from '../lib/routing'

import Dropdown from '../dropdown/dropdown'

@observer
export default class Nav extends Component {
  render () {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className='container-fluid'>
          <ul className='nav navbar-nav'>
            <li className='left-nav'>
              { this._leftNav() }
            </li>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li>
              <a onClick={this._openDocs} href='#'>
                <i className='fa fa-graduation-cap'></i>{' '}
                Docs
              </a>
            </li>
            <li>
              <a onClick={this._openChat} href='#'>
                <i className='fa fa-comments'></i>{' '}
                Chat
              </a>
            </li>
            { this._userStateButton() }
          </ul>
        </div>
      </nav>
    )
  }

  _leftNav = () => {
    const project = viewStore.currentView.project

    // project mode
    if (!appStore.isGlobalMode) {
      return <div>{project && project.displayName}</div>
    }

    // global mode, on project page
    if (appStore.isGlobalMode && project) {
      return (
        <Link to={routes.intro()}>
          <i className='fa fa-chevron-left'></i> Back
        </Link>
      )
    }

    // global mode, on intro page
    return (
      <div className='logo'>
        <img src='img/cypress-inverse.png' />
      </div>
    )
  }

  _userStateButton = () => {
    if (!authStore.isAuthenticated) {
      return (
        <button onClick={this._login}>
          <i className='fa fa-sign-in' /> Log In
        </button>
      )
    }

    return (
      <Dropdown
        className='dropdown-toggle'
        chosen={{ id: 'user' }}
        others={[{ id: 'logout' }]}
        onSelect={this._select}
        renderItem={this._item}
        keyProperty='id'
      />
    )
  }

  _item (item) {
    if (item.id === 'user') {
      return (
        <span>
          <img
            className='user-avatar'
            height='13'
            width='13'
            src={`${gravatarUrl(authStore.user.email)}`}
          />
          {' '}{ authStore.user.displayName }
        </span>
      )
    } else {
      return (
        <span>
          <i className='fa fa-sign-out'></i>{' '}
          Log Out
        </span>
      )
    }
  }

  _select = (item) => {
    if (item.id === 'logout') {
      appApi.logOut()
    }
  }

  _login () {
    viewStore.showLogin()
  }

  _openDocs (e) {
    e.preventDefault()
    ipc.externalOpen('https://on.cypress.io')
  }

  _openChat (e) {
    e.preventDefault()
    ipc.externalOpen('https://on.cypress.io/chat')
  }
}

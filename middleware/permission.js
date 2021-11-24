import { getModule } from 'vuex-module-decorators'
import GeneralModule from '../store/general/index'

export default function ({ store, redirect, $axios }) {
  const generalModule = getModule(GeneralModule, store)
  try {
    $axios
      .get('/admins/permissions/', {
        headers: {
          Authorization: localStorage.getItem('auth._token.local'),
          Accept: 'application/json; version=1.0;',
        },
      })
      .then(function (response) {
        const currentUrl = window.location.pathname
        generalModule.setPermissions(response.data)
        if (currentUrl.includes('admin') && response.data.admins) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('user') && response.data.users) {
          return redirect('/noaccess')
        } else if (
          currentUrl.includes('transactions') &&
          response.data.transactsions
        ) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('top') && response.data.topUsers) {
          return redirect('/noaccess')
        } else if (
          currentUrl.includes('customerclub') &&
          response.data.customerclub
        ) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('message') && response.data.messages) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('reports') && response.data.reports) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('tickets') && response.data.tickets) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('content') && response.data.contents) {
          return redirect('/noaccess')
        } else if (
          currentUrl.includes('transmission') &&
          response.data.transmissions
        ) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('factor') && response.data.factors) {
          return redirect('/noaccess')
        } else if (currentUrl.includes('setting') && response.data.settings) {
          return redirect('/noaccess')
        } else {
        }
      })
  } catch (e) {
    this.$router.go()
  } finally {
  }
}

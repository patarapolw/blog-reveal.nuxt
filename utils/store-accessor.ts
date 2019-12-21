import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import GlobalModule from '../store/global'

let globalStore: GlobalModule

function initialiseStores (store: Store<any>): void {
  globalStore = getModule(GlobalModule, store)
}

export {
  initialiseStores,
  globalStore,
}

import { Module, VuexModule, Action } from 'vuex-module-decorators';
import { fetchOrLocal } from '../utils/fetch';
import { DataType } from '../utils/build-api';

@Module({
  name: 'global',
  stateFactory: true,
  namespaced: true,
})
export default class GlobalModule extends VuexModule {
  config!: any;
  hash: Record<DataType, Record<string, string>> = {
    posts: {},
    slides: {},
    resources: {}
  }

  @Action
  async nuxtServerInit({commit}: any) {
    const [
      config,
      hPosts,
      hSlides,
      hResources
    ] = await Promise.all([
      fetchOrLocal(`/api/config.json`, null),
      fetchOrLocal(`/api/hash/posts.json`, null),
      fetchOrLocal(`/api/hash/slides.json`, null),
      fetchOrLocal(`/api/hash/resources.json`, null),
    ]);

    commit("config", JSON.parse(config));
    commit("hash", {
      posts: JSON.parse(hPosts),
      slides: JSON.parse(hSlides),
      resources: JSON.parse(hResources)
    });
  }
}
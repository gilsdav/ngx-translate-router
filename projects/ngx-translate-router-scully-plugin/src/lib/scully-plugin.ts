import { registerPlugin} from '@scullyio/scully';
import { parseRoutes } from './translator';

export const NgxTranslateRouter = 'NgxTranslateRouter';

const translationPlugin = (config) => async(routes) => {
  return parseRoutes(routes, config);
};

export function registerNgxTranslateRouter(config: { langs: {[lang: string]: string} }) {
  registerPlugin('routeProcess', NgxTranslateRouter, translationPlugin(config), 1, { });
  return NgxTranslateRouter;
}

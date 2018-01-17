import Raven from 'raven-js';

import {AppModule} from 'metabolica';
import {MaintenanceModule} from 'metabolica/src/app/shared/maintenance/maintenance.module';

import {ProjectModule} from 'metabolica-core';
import {PoolsModule} from 'metabolica-core';
import {PlatesModule} from 'metabolica-core';
import {ExperimentsModule} from 'metabolica-core';
import {SettingsModule} from 'metabolica-core';
import {MediaModule} from 'metabolica-core';

import {VariantsModule} from 'metabolica-variants';
import {VizModule} from 'metabolica-viz';
import {PathwaysModule} from 'metabolica-pathways';
import {TheoreticalYieldModule} from 'metabolica-yields';
import {PathwayVisModule} from 'metabolica-map';
import {UploadModule} from 'metabolica-upload';
import {AboutModule} from 'metabolica-about';
import {LoginModule} from 'metabolica-login';

import './style.scss';


const DecafAppModule = angular.module('DecafApp', [
    AppModule.name,
    MaintenanceModule.name,
    ProjectModule.name,
    PoolsModule.name,
    PlatesModule.name,
    ExperimentsModule.name,
    SettingsModule.name,
    MediaModule.name,
    VariantsModule.name,
    VizModule.name,
    UploadModule.name,
    PathwaysModule.name,
    TheoreticalYieldModule.name,
    PathwayVisModule.name,
    LoginModule.name,
    AboutModule.name
]);

if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
    Raven.addPlugin(require('raven-js/plugins/angular'), angular);
    DecafAppModule.requires.push('ngRaven');
}


DecafAppModule.config((appNameProvider, appAuthProvider, potionProvider, decafAPIProvider, modelWSProvider, modelAPIProvider, appNavigationProvider, pathwaysAPIProvider, pathwaysWSProvider) => {
    const noAuthModules = ['Experiments', 'Pools', 'Media'];
    appNavigationProvider.navigation
      .filter((app) => noAuthModules.includes(app.title))
      .forEach((el) => {
       el.authRequired = false;
     });

    appNameProvider.name = 'DD-DeCaF';
    appAuthProvider.isRequired = false;
    process.env.TRUSTED_URLS.split(',').forEach((url) => {
      appAuthProvider.trustedURLs.add(url)
    });
    potionProvider.config({host: process.env.POTION_API_HOST, prefix: process.env.POTION_API_PREFIX});
    decafAPIProvider.host = process.env.DECAF_API;
    modelAPIProvider.host = process.env.MODEL_API;
    modelWSProvider.host = process.env.MODEL_WS_HOST;
    modelWSProvider.prefix = process.env.MODEL_WS_PREFIX;
    pathwaysAPIProvider.host = process.env.PATHWAYS_API;
    pathwaysWSProvider.host = process.env.PATHWAYS_WS;

}).config(($mdThemingProvider) => {
    const environment2ColorScheme = {
        'dev': 'light-green',
        'staging': 'amber',
        'prod': 'light-blue',
    };
    const color = environment2ColorScheme[process.env.ENVIRONMENT] || 'light-blue';
    $mdThemingProvider.theme('default')
        .primaryPalette(color, {
            'default': '700'
        })
        .accentPalette(color, {
            'default': '400',
        });
}).run(($rootScope, $window, Session) => {
    if (process.env.SENTRY_DSN) {
        const setRavenUser = () => {
            Session.getCurrentUser()
                .then((user) => {
                    Raven.setUser({
                        id: user.id,
                        email: user.username,
                    })
                });
        };
        if (Session.isAuthenticated()) {
            setRavenUser();
        } else {
            $window.localStorage.setItem('sessionJWT', process.env.GUEST_TOKEN);
        }
        $rootScope.$on('session:login', setRavenUser);
        $rootScope.$on('session:logout', () => {
            Raven.setUserContext();
            $window.localStorage.setItem('sessionJWT', process.env.GUEST_TOKEN);
        });
    }
});

export {DecafAppModule};

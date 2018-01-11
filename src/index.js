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

DecafAppModule.config((appNameProvider, appAuthProvider, potionProvider, decafAPIProvider, modelWSProvider, modelAPIProvider, pathwaysAPIProvider, pathwaysWSProvider) => {
    appNameProvider.name = 'DD-DeCaF';
    appAuthProvider.isRequired = false;
    appAuthProvider.trustedURLs.add('https://iloop-staging.dd-decaf.eu');
    appAuthProvider.trustedURLs.add('https://data.dd-decaf.eu');
    appAuthProvider.trustedURLs.add('https://api.dd-decaf.eu');
    appAuthProvider.trustedURLs.add('https://api-staging.dd-decaf.eu');
    appAuthProvider.trustedURLs.add('http://localhost');
    potionProvider.config({host: 'https://iloop-staging.dd-decaf.eu', prefix: '/api'});
    decafAPIProvider.host = 'https://api-staging.dd-decaf.eu';
    modelAPIProvider.host = 'https://api-staging.dd-decaf.eu';
    modelWSProvider.host = 'wss://api-staging.dd-decaf.eu';
    modelWSProvider.prefix = '/wsmodels';
    pathwaysAPIProvider.host = 'https://api-staging.dd-decaf.eu/pathways';
    pathwaysWSProvider.host = 'wss://api-staging.dd-decaf.eu/pathways';

}).config(($mdThemingProvider) => {
    const hostname2ColorScheme = {
        'localhost': 'light-green',
        'app.dd-decaf.eu': 'light-blue',
        'staging.dd-decaf.eu': 'amber',
    }
    const color = hostname2ColorScheme[window.location.hostname] || 'light-blue';
    $mdThemingProvider.theme('default')
        .primaryPalette(color, {
            'default': '700'
        })
        .accentPalette(color, {
            'default': '400',
        });
}).run(($rootScope, Session) => {
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
        }
        $rootScope.$on('session:login', setRavenUser);
        $rootScope.$on('session:logout', () => {
            Raven.setUserContext();
        });
    }
});

export {DecafAppModule};

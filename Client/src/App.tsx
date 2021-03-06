import { IonApp, IonSpinner, setupIonicReact } from '@ionic/react';
import React, { useEffect, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Swiper theme
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';

/* Router */
import { Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router'

import Main from './pages/Main';
import { onLoad } from './components/StorageService';

setupIonicReact({ swipeBackEnabled: false });

// Main react application component
const App: React.FC = () => {
    const [busy, setBusy] = useState(true);

    useEffect(() => {
        onLoad().then(() => setBusy(false))
    })

    return (
        <IonApp>
            {busy ? <IonSpinner /> :
                <IonReactRouter>
                    <Route path='/' component={Main} />
                </IonReactRouter>}
        </IonApp>
    );
};

export default App;

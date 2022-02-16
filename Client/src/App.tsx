import { IonAccordion, IonAccordionGroup, IonApp, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonMenu, IonMenuButton, IonMenuToggle, IonModal, IonPage, IonRoute, IonRouterOutlet, IonRow, IonTab, IonTabBar, IonTabButton, IonTabs, IonText, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { accessibilityOutline, addCircleOutline, addOutline, albumsOutline, logIn, optionsOutline, settingsOutline, tabletLandscapeOutline, tabletPortraitOutline } from 'ionicons/icons'
import React, { FormEventHandler, useRef, useState } from 'react';

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

/* Router */
import { Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router'

import Main from './pages/Main';
import Login from './pages/Login';
import { getConnections } from './components/vars';

setupIonicReact();

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <Route path='/' component={getConnections().length === 0 && false ? Login : Main} />
            </IonReactRouter>
        </IonApp>
    );
};

export default App;

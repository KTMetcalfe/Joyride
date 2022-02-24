import { IonPage, IonModal, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonSpinner } from '@ionic/react';
import { addCircleOutline, albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';

import { clearStorage, getCurrentAccount, onLoad, setCurrentAccount } from '../components/StorageService';

import Login from './Login';
import Signup from './Signup';

const Main: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const pageRef = useRef();

  return (
    <IonPage ref={pageRef}>
        <IonModal trigger="addConnection" mode='ios' swipeToClose={true} presentingElement={pageRef.current} isOpen={showLogin} onDidDismiss={() => setShowLogin(false)}>
          <IonToolbar>
            <IonTitle class='ion-text-center'>Login</IonTitle>
            <IonItem slot='end' button onClick={() => setShowLogin(false)}></IonItem>
          </IonToolbar>
          <Login />
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem onClick={() => setShowSignup(true)}>
                  <IonLabel>Sign up</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonModal>
      <IonModal trigger="addConnection" mode='ios' swipeToClose={true} presentingElement={pageRef.current} isOpen={showSignup} onDidDismiss={() => setShowSignup(false)}>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Signup</IonTitle>
          <IonItem slot='end' button onClick={() => setShowSignup(false)}></IonItem>
        </IonToolbar>
        <Signup />
      </IonModal>
      <IonMenu id='optionsMenu' side='start' contentId='outlet'>
        <IonHeader>
          <IonToolbar>
            <IonTitle class="ion-text-center">Options</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines='none'>
                  <IonIcon slot='start' icon={tabletLandscapeOutline}></IonIcon>
                  <IonLabel>Filters</IonLabel>
                </IonItem>
                <IonList>

                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonAccordionGroup>
                  <IonAccordion value="databases">
                    <IonItem slot="header">
                      <IonIcon slot='start' icon={albumsOutline}></IonIcon>
                      <IonLabel>Advanced</IonLabel>
                    </IonItem>
                    <IonList slot="content">

                    </IonList>
                  </IonAccordion>
                </IonAccordionGroup>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonMenu>
      <IonMenu id='accountMenu' side='end' contentId='outlet'>
        <IonHeader>
          <IonToolbar>
            <IonTitle class="ion-text-center">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines='none'>
                  <IonLabel>Favorites</IonLabel>
                  <IonButton onClick={() => setShowLogin(true)}>
                    <IonIcon slot='icon-only' icon={addCircleOutline} />
                  </IonButton>
                  <IonButton onClick={() => setShowSignup(true)}>
                    <IonIcon slot='icon-only' icon={addCircleOutline} />
                  </IonButton>
                </IonItem>
                <IonList>

                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonMenu>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Joyride</IonTitle>
          <IonButtons slot='start'>
            <IonMenuButton menu='start'>
              <IonIcon icon={optionsOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>
          <IonButtons slot='end'>
            <IonMenuButton menu='end'>
              <IonIcon icon={accessibilityOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonTabs>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='structure' href='/structure'>
              <IonLabel>Structure</IonLabel>
            </IonTabButton>
            <IonTabButton tab='content' href='/content'>
              <IonLabel>Content</IonLabel>
            </IonTabButton>
            <IonTabButton tab='query' href='/query'>
              <IonLabel>Query</IonLabel>
            </IonTabButton>
          </IonTabBar>
          <IonRouterOutlet id='outlet'>
            <Route path="/structure" component={StructurePage} exact />
            <Route path="/content" component={ContentPage} exact />
            <Route path="/query" component={QueryPage} exact />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

const Loader: React.FC = () => {
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    onLoad().then(() => setBusy(false))
  })

  return (busy ? <IonSpinner /> : <Main />)
}

export default Loader;
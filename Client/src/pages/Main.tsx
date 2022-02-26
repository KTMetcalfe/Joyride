import { IonPage, IonModal, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonSpinner, useIonModal } from '@ionic/react';
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
  const pageRef = useRef();

  const handlePresentLogin = () => {
    presentLogin({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: pageRef.current
    })
  };

  const handleDismissLogin = () => {
    dismissLogin();
  };

  const [presentLogin, dismissLogin] = useIonModal(Login, {
    onDismiss: handleDismissLogin
  })

  const handlePresentSignup = () => {
    presentSignup({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: pageRef.current
    })
  };

  const handleDismissSignup = () => {
    dismissSignup();
  };

  const [presentSignup, dismissSignup] = useIonModal(Signup, {
    onDismiss: handleDismissSignup,
    onClose: handleDismissSignup
  })

  return (
    <IonPage ref={pageRef}>
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
                  <IonButton onClick={handlePresentLogin}>
                    <IonIcon slot='icon-only' icon={addCircleOutline} />
                  </IonButton>
                  <IonButton onClick={handlePresentSignup}>
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
      <IonContent id='outlet'>
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
          <IonRouterOutlet>
            <Route path="/structure" component={StructurePage} exact />
            <Route path="/content" component={ContentPage} exact />
            <Route path="/query" component={QueryPage} exact />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
import { IonPage, IonModal, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonSpinner, useIonModal } from '@ionic/react';
import { addCircleOutline, albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline, starOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';

import { clearStorage, getCurrentAccount, onLoad, setCurrentAccount } from '../components/StorageService';

import Login from './Login';
import Signup from './Signup';

const Main: React.FC = () => {
  const mainRef = useRef();

  return (
    <IonPage ref={mainRef}>
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
                  <IonIcon slot='start' icon={starOutline}></IonIcon>
                  <IonLabel>Favorites</IonLabel>
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
            <Route path="/structure" render={() => (<StructurePage pageRef={mainRef} />)} exact />
            <Route path="/content" component={ContentPage} exact />
            <Route path="/query" component={QueryPage} exact />
            <Route path="/" render={() => <Redirect to="/structure" />} exact={true} />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
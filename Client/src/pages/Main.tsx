import { IonPage, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonButton, useIonModal } from '@ionic/react';
import { albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline, starOutline } from 'ionicons/icons';
import React, { useRef } from 'react';
import { Redirect, Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';
import Login from './Login';
import Signup from './Signup';
import { curr_priv, curr_user } from '../components/StorageService';
import AddVehicle from './AddVehicle';
import AdminPage from './Admin';

const Main: React.FC = () => {
  const mainRef = useRef();

  const handlePresentLogin = () => {
    presentLogin({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: mainRef.current
    })
  };

  const handleDismissLogin = () => {
    dismissLogin();
  };

  const [presentLogin, dismissLogin] = useIonModal(Login, {
    onDismiss: handleDismissLogin
  })

  const handlePresentAddVehicle = () => {
    presentAddVehicle({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: mainRef.current
    })
  };

  const handleDismissAddVehicle = () => {
    dismissAddVehicle();
  };

  const [presentAddVehicle, dismissAddVehicle] = useIonModal(AddVehicle, {
    onDismiss: handleDismissAddVehicle
  })

  return (
    <IonPage ref={mainRef}>
      <IonMenu id='optionsMenu' side='start' contentId='outlet'>
        <IonHeader>
          <IonToolbar>
            <IonTitle class="ion-text-center">Options</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent forceOverscroll={false}>
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
        <IonContent forceOverscroll={false}>
          <IonGrid>
            {curr_user === '' ?
              <IonRow>
                <IonCol>
                  <IonButton color="secondary" onClick={handlePresentLogin} expand='block'>
                    Login
                  </IonButton>
                </IonCol>
              </IonRow>
              : false}
            {curr_user !== '' ?
              <IonRow>
                <IonCol>
                  <IonButton color="secondary" onClick={handlePresentAddVehicle} expand='block'>
                    Add vehicle
                  </IonButton>
                </IonCol>
              </IonRow>
              : false}
            <IonRow>
              <IonCol>
                <IonAccordionGroup>
                  <IonAccordion>
                    <IonItem slot="header">
                      <IonIcon slot='start' icon={starOutline}></IonIcon>
                      <IonLabel>Favorites</IonLabel>
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
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Joyride</IonTitle>
          <IonButtons slot='start' class='ion-padding-start'>
            <IonMenuButton menu='start'>
              <IonIcon icon={optionsOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>
          <IonButtons slot='end' class='ion-padding-end'>
            <IonMenuButton menu='end'>
              <IonIcon icon={accessibilityOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id='outlet' forceOverscroll={false}>
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
            {curr_priv >= 2 ?
              <IonTabButton tab='admin' href='/admin'>
                <IonLabel>Admin</IonLabel>
              </IonTabButton>
              : false}
          </IonTabBar>
          <IonRouterOutlet>
            <Route path="/structure" render={() => (<StructurePage pageRef={mainRef} />)} exact />
            <Route path="/content" component={ContentPage} exact />
            <Route path="/query" component={QueryPage} exact />
            <Route path="/" render={() => <Redirect to="/structure" />} exact={true} />
            <Route path="/admin" render={() => curr_priv >= 2 ? <AdminPage /> : <Redirect to="/structure" />} exact />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
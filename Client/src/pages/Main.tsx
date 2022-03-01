import { IonPage, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonButton, useIonModal } from '@ionic/react';
import { albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline, starOutline, removeCircleOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';
import Login from './Login';
import Signup from './Signup';
import { curr_priv, curr_pswd, curr_user } from '../components/StorageService';
import AddVehicle from './AddVehicle';
import AdminPage from './Admin';

const Main: React.FC = () => {
  const mainRef = useRef();

  const [list, setList] = useState<Array<any>>();

  const getFavorites = () => {
    fetch('https://api.kianm.net/index.php/account/favorites', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setList(result)
      })
  }

  const removeFavorite = ($id: number) => {
    fetch('https://api.kianm.net/index.php/account/removeFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => getFavorites())
  }

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

  const handlePresentAdmin = () => {
    presentAdmin({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: mainRef.current
    })
  };

  const handleDismissAdmin = () => {
    dismissAdmin();
  };

  const [presentAdmin, dismissAdmin] = useIonModal(AdminPage, {
    onDismiss: handleDismissAdmin
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
      <IonMenu id='accountMenu' side='end' contentId='outlet' onIonDidOpen={() => getFavorites()}>
        <IonHeader>
          <IonToolbar>
            <IonTitle class="ion-text-center">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent forceOverscroll={false}>
          <IonGrid>
            {curr_priv >= 2 ?
              <IonRow>
                <IonCol>
                  <IonButton color="danger" onClick={handlePresentAdmin} expand='block'>
                    Admin
                  </IonButton>
                </IonCol>
              </IonRow>
              : false}
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
                      {list?.map(v =>
                        <IonItem key={v.id}>
                          <IonGrid>
                            <IonRow>
                              <IonCol>Model:</IonCol>
                              <IonCol>{v.model}</IonCol>
                              <IonCol>Year:</IonCol>
                              <IonCol>{v.model_year}</IonCol>
                              <IonCol>
                                <IonButton onClick={() => removeFavorite(v.id)}>
                                  <IonIcon slot='icon-only' icon={removeCircleOutline} />
                                </IonButton>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>
                      )}
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
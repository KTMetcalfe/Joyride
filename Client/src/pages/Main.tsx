import { IonPage, IonModal, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';
import { addCircleOutline, albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';

import { clearStorage } from '../components/StorageService';

const Main: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  //const [conns, setConns] = useState<connectionInterface[]>([]);
  //loadConnections().then(() => setConns(getConnections));

  const pageRef = useRef();

  return (
    <IonPage ref={pageRef}>
      <IonModal trigger="addConnection" mode='ios' swipeToClose={true} presentingElement={pageRef.current} isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Demo Modal</IonTitle>
          <IonItem slot='end' button onClick={() => setShowModal(false)}></IonItem>
        </IonToolbar>
        <IonGrid>
          <form>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonInput placeholder='Nickname' id='name' required></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput placeholder='Address' id='ip' required></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput placeholder='Username' id='user' required></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput placeholder='Password' id='pswd' required></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput placeholder='Main Database' id='ddb' required></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand='block'>
                  <IonIcon slot='icon-only' icon={addCircleOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
          <IonRow>
            <IonCol>
              <IonItem button onClick={clearStorage}>
                <IonLabel>Clear Storage</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
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
                  <IonButton onClick={() => setShowModal(true)}>
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
            <IonTabButton tab='structure' href='/dashboard/structure'>
              <IonLabel>Structure</IonLabel>
            </IonTabButton>
            <IonTabButton tab='content' href='/dashboard/content'>
              <IonLabel>Content</IonLabel>
            </IonTabButton>
            <IonTabButton tab='query' href='/dashboard/query'>
              <IonLabel>Query</IonLabel>
            </IonTabButton>
          </IonTabBar>
          <IonRouterOutlet id='outlet'>
            <Route path="/dashboard/structure" component={StructurePage} exact />
            <Route path="/dashboard/content" component={ContentPage} exact />
            <Route path="/dashboard/query" component={QueryPage} exact />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
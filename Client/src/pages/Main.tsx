import { IonPage, IonModal, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';
import { addCircleOutline, albumsOutline, tabletLandscapeOutline, optionsOutline, accessibilityOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Route } from 'react-router';

import StructurePage from './Structure';
import ContentPage from './Content';
import QueryPage from './Query';

import { connectionInterface, getConnections, getCurrConnection, getCurrDatabase, getDatabases, getTables, loadConnections, setCurrConnection, setCurrDatabase, setCurrTable } from '../components/vars';
import { clearStorage, storeConnection } from '../components/StorageService';

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
                <IonButton expand='block' onClick={readConnection}>
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
                  {getTables().map((t) =>
                    <IonItem button onClick={() => setCurrTable(t)} key={t.name} routerLink={window.location.pathname}>{t.name}</IonItem>
                  )}
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
                      {getDatabases().map((d) =>
                        <IonItem button onClick={() => setCurrDatabase(d)} key={d.name} routerLink={window.location.pathname}>{d.name}</IonItem>
                      )}
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
                  {getConnections().map((c) =>
                    <IonItem button onClick={() => connect(c)} key={c.name} routerLink={window.location.pathname}>{c.name}</IonItem>
                  )}
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

const connect = (c: connectionInterface) => {
  setCurrConnection(c);
  console.log(getCurrDatabase().name);
}

const readConnection = () => {
  const name = window.document.getElementById('name') as HTMLInputElement;
  const ip = window.document.getElementById('ip') as HTMLInputElement;
  const user = window.document.getElementById('user') as HTMLInputElement;
  const pswd = window.document.getElementById('pswd') as HTMLInputElement;
  const ddb = window.document.getElementById('ddb') as HTMLInputElement;

  if (name.value !== '' && ip.value !== '' && user.value !== '' && pswd.value !== '') {
    storeConnection(
      name.value,
      ip.value,
      user.value,
      pswd.value,
      ddb.value
    );

    return true;
  } else return false;
}

export default Main;
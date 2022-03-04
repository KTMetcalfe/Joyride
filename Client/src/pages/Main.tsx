import { IonPage, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonButton, useIonModal, IonSelect, IonSelectOption, useIonPopover, IonFooter, IonChip } from '@ionic/react';
import { optionsOutline, starOutline, removeCircleOutline, filterOutline, personOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import StructurePage from './Structure';
import VehiclesPage from './Vehicles';
import LoginModal from './Login';
import { clearStorage, curr_priv, curr_pswd, curr_user, filter, setFilter, setRefreshQuery, setResetQuery } from '../components/StorageService';
import AddVehicle from './AddVehicle';
import AdminModal from './Admin';

import './Main.css';

const Main: React.FC = () => {
  const mainRef = useRef();

  const [list, setList] = useState<Array<any>>([]);
  const [yearStart, setYearStart] = useState(0);
  const [yearEnd, setYearEnd] = useState(0);
  const [updateState, setUpdateState] = useState(false);

  const updateFilter = () => {
    const newFilter = {
      "year_start": yearStart,
      "year_end": yearEnd
    }

    if (JSON.stringify(newFilter) !== JSON.stringify(filter)) {
      setFilter(newFilter);
      setResetQuery(true);

      setUpdateState(true);
      setUpdateState(false);
    }
  }

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
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/account/removeFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => { getFavorites() })
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

  const [presentLogin, dismissLogin] = useIonModal(LoginModal, {
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

  const [presentAdmin, dismissAdmin] = useIonModal(AdminModal, {
    onDismiss: handleDismissAdmin
  })

  let years: Array<number> = [];
  for (let year = new Date().getFullYear(); year >= 1900; year--) {
    years.push(year);
  }

  // Dummy popover
  useIonPopover(
    <IonList>
      {years.map(year => <IonItem button onClick={() => setYearStart(year)} key={year}>{year}</IonItem>)}
    </IonList>
  )

  const customPopoverOptions = {
    className: 'year-pop'
  };

  return (
    <IonPage ref={mainRef}>
      <IonMenu id='optionsMenu' side='start' contentId='outlet' onIonDidClose={() => updateFilter()}>
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
                  <IonIcon slot='start' icon={filterOutline}></IonIcon>
                  <IonLabel>Filters</IonLabel>
                </IonItem>
                <IonList>
                  <IonItem>
                    <IonLabel>Min</IonLabel>
                    <IonSelect mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={yearStart} okText="Vroom" cancelText="Kerplut" onIonChange={e => setYearStart(e.detail.value!)}>
                      {years.map(year => <IonSelectOption key={year} value={year}>{year}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Max</IonLabel>
                    <IonSelect mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={yearEnd} okText="Vroom" cancelText="Kerplut" onIonChange={e => setYearEnd(e.detail.value!)}>
                      {years.map(year => <IonSelectOption key={year} value={year}>{year}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonMenu>
      <IonMenu id='accountMenu' side='end' contentId='outlet' onIonDidOpen={() => { if (curr_user !== '') { getFavorites() } }}>
        <IonHeader>
          <IonToolbar>
            <IonTitle class="ion-text-center">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent forceOverscroll={false}>
          {curr_user !== '' ?
            <IonItem lines='none' color='primary'>
              <IonLabel class='ion-text-center'>Welcome, {curr_user}</IonLabel>
            </IonItem>
            : false}
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
        <IonFooter>
          <div className='footer-bg'>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButtons class='center-buttons'>
                    <IonButton fill='clear' color='primary' onClick={() => { clearStorage(); window.location.reload() }}>Sign out</IonButton>
                  </IonButtons>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonFooter>
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
              <IonIcon icon={personOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id='outlet' forceOverscroll={false}>
        <IonTabs>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='vehicles' href='/vehicles'>
              <IonLabel>Vehicles</IonLabel>
            </IonTabButton>
            <IonTabButton tab='structure' href='/structure'>
              <IonLabel>Structure</IonLabel>
            </IonTabButton>
          </IonTabBar>
          <IonRouterOutlet>
            <Route path="/structure" render={() => (<StructurePage pageRef={mainRef} />)} exact />
            <Route path="/vehicles" render={() => (<VehiclesPage />)} exact />
            <Route path="/" render={() => <Redirect to="/vehicles" />} exact={true} />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
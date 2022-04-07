import { IonPage, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonButton, useIonModal, IonSelect, IonSelectOption, useIonPopover, IonFooter, IonChip, IonRange, IonInput, IonCheckbox, IonAvatar } from '@ionic/react';
import { optionsOutline, starOutline, removeCircleOutline, filterOutline, personOutline, closeOutline, starSharp, star, checkboxOutline, checkbox, stopOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import StructurePage from './Structure';
import VehiclesPage from './Vehicles';
import LoginModal from './Login';
import { clearStorage, curr_priv, curr_pswd, curr_user, filter, setFilter, setRefreshQuery, setResetQuery } from '../components/StorageService';
import AddVehicle from './AddVehicle';
import AdminModal from './Admin';

import './Main.css';
import VehicleCard from './VehicleCard';

const Main: React.FC = () => {
  const mainRef = useRef();

  const [favoritesList, setFavoritesList] = useState<Array<any>>([]);
  const [updateState, setUpdateState] = useState(false);

  // Filter limits
  const yearMin = 1900;
  const yearMax = new Date().getFullYear() + 2;
  const capacityMin = 1;
  const capacityMax = 7;
  // Filter variables
  const [yearStart, setYearStart] = useState(yearMin);
  const [yearEnd, setYearEnd] = useState(yearMax);
  const [priceStart, setPriceStart] = useState(0);
  const [priceEnd, setPriceEnd] = useState(0);
  const [capacityStart, setCapacityStart] = useState(capacityMin);
  const [capacityEnd, setCapacityEnd] = useState(capacityMax);
  const [mileageStart, setMileageStart] = useState(0);
  const [mileageEnd, setMileageEnd] = useState(0);
  const [transmissionType, setTransmissionType] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [modelList, setModelList] = useState<Array<string>>([]);
  const [ratingStart, setRatingStart] = useState(0);
  // Filter lists
  let years: Array<number> = [];
  for (let year = yearMax; year >= yearMin; year--) {
    years.push(year);
  }
  let capacities: Array<number> = [];
  for (let cap = capacityMax; cap >= capacityMin; cap--) {
    capacities.push(cap);
  }
  let transmissions: Array<string> = ['Manual', 'Automatic'];
  let colors: Array<string> = ['White', 'Black', 'Gray', 'Silver', 'Red', 'Blue', 'Brown',
    'Green', 'Beige', 'Orange', 'Gold', 'Yellow', 'Purple'];
  let makes: Array<string> = ['Toyota', 'Mercedes-Benz', 'Tesla', 'Volkswagen', 'BMW', 'Porsche', 'Honda', 'Ford',
    'Nissan', 'Volvo', 'Audi', 'Hyundai', 'Chevrolet', 'Lexus', 'Land Rover', 'Renault', 'Ferrari', 'Subaru', 'BYD',
    'Haval', 'Cadillac', 'Kia', 'Jeep', 'BUICK', 'Geely', 'Suzuki', 'GMC', 'MINI', 'Polaris', 'RAM Trucks', 'Skoda',
    'Isuzu', 'Scania', 'Mazda', 'Peugeot', 'LI AUTO', 'Lincoln', 'Jaguar', 'NIO', 'Great Wall', 'Hino', 'Bentley',
    'Bajaj Auto', 'Mahindra', 'Maruti Suzuki', 'Xpeng', 'MAN', 'Hero', 'Daihatsu', 'Fiat', 'Lamborghini', 'Iveco',
    'Opel', 'FISKER', 'Foton', 'Jiefang', 'Song', 'Harley-Davidson', 'Citroën', 'Rolls- Royce', 'Dongfeng', 'Acura',
    'McLaren', 'Changan', 'Kenworth', 'Maserati', 'Yamaha', 'Seat', 'Tata Motors', 'Aston Martin', 'Sinotruk',
    'Peterbilt', 'JAC Motors', 'Yutong', 'Dacia', 'Dodge', 'KTM', 'Wuling', 'DAF', 'Roewe', 'Ashok Leyland', 'GAC',
    'Vauxhall', 'TVS', 'Oshkosh', 'Paccar', 'Royal Enfield', 'Tang', 'WEY', 'Mack', 'Infiniti', 'Yulon', 'MG', 'Lada',
    'Qin', 'Piaggio', 'Renault Samsung', 'UD Trucks', 'Baojun', 'ELMS',]

  // Filter controller
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

  const getModels = (make: string) => {
    setModelList([]);
    if (make !== '') {
      fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/' + make + '?format=json', {
        method: 'GET'
      })
        .then(e => e.json())
        .then(result => {
          let models: Array<string> = [];
          for (let i = 0; i < Object.keys(result.Results).length; i++) {
            models.push(result.Results[i].Model_Name)
          }
          setModelList(models);
        })
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
        setFavoritesList(result);
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

  const customPopoverOptions = {
    className: 'year-pop'
  };

  const [selectedID, setSelectedID] = useState(0);

  const handlePresentVehicle = (id: number) => {
    setSelectedID(id);
    presentVehicle({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: mainRef.current
    });
  };

  const handleDismissVehicle = () => {
    dismissVehicle();
  };

  const [presentVehicle, dismissVehicle] = useIonModal(VehicleCard, {
    id: selectedID,
    onDismiss: handleDismissVehicle
  })

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
                  <IonButtons>
                    <IonButton color='primary' fill='clear' onClick={() => {
                      setYearStart(yearMin);
                      setYearEnd(yearMax);
                      setPriceStart(0);
                      setPriceEnd(0);
                      setCapacityStart(capacityMin);
                      setCapacityEnd(capacityMax);
                      setMileageStart(0);
                      setMileageEnd(0);
                      setTransmissionType('');
                      setVehicleColor('');
                      setMake('');
                      setModel('');
                      setModelList([]);
                      setRatingStart(0);
                    }}>
                      Reset
                    </IonButton>
                  </IonButtons>
                </IonItem>
                <IonList>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Year:</IonLabel>
                          {yearStart !== yearMin || yearEnd !== yearMax ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setYearStart(yearMin); setYearEnd(yearMax) }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip'>
                            <IonSelect class='filter-select' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={yearStart} onIonChange={e => setYearStart(e.detail.value!)}>
                              {years.map(year => <IonSelectOption key={year} value={year}>{year}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                          <IonLabel>-</IonLabel>
                          <IonChip class='filter-chip'>
                            <IonSelect class='filter-select' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={yearEnd} onIonChange={e => setYearEnd(e.detail.value!)}>
                              {years.map(year => <IonSelectOption key={year} value={year}>{year}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Price:</IonLabel>
                          {priceStart !== 0 || priceEnd !== 0 ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setPriceStart(0); setPriceEnd(0) }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip'>
                            <IonInput inputmode='numeric' type='number' value={priceStart} onIonChange={e => setPriceStart(Number(e.detail.value!))} />
                          </IonChip>
                          <IonLabel>-</IonLabel>
                          <IonChip class='filter-chip'>
                            <IonInput inputmode='numeric' type='number' value={priceEnd} onIonChange={e => setPriceEnd(Number(e.detail.value!))} />
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Capacity:</IonLabel>
                          {capacityStart !== capacityMin || capacityEnd !== capacityMax ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setCapacityStart(capacityMin); setCapacityEnd(capacityMax) }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip'>
                            <IonSelect class='filter-select' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={capacityStart} onIonChange={e => setCapacityStart(e.detail.value!)}>
                              {capacities.map(cap => <IonSelectOption key={cap} value={cap}>{cap === 7 ? cap + "+" : cap}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                          <IonLabel>-</IonLabel>
                          <IonChip class='filter-chip'>
                            <IonSelect class='filter-select' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={capacityEnd} onIonChange={e => setCapacityEnd(e.detail.value!)}>
                              {capacities.map(cap => <IonSelectOption key={cap} value={cap}>{cap === 7 ? cap + "+" : cap}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Mileage:</IonLabel>
                          {mileageStart !== 0 || mileageEnd !== 0 ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setMileageStart(0); setMileageEnd(0) }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip'>
                            <IonInput inputmode='numeric' type='number' value={mileageStart} onIonChange={e => setMileageStart(Number(e.detail.value!))} />
                          </IonChip>
                          <IonLabel>-</IonLabel>
                          <IonChip class='filter-chip'>
                            <IonInput inputmode='numeric' type='number' value={mileageEnd} onIonChange={e => setMileageEnd(Number(e.detail.value!))} />
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Transmission Type:</IonLabel>
                          {transmissionType !== '' ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setTransmissionType('') }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip-100'>
                            <IonSelect class='filter-select-100' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={transmissionType} onIonChange={e => setTransmissionType(e.detail.value!)}>
                              {transmissions.map(trans => <IonSelectOption key={trans} value={trans}>{trans}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Color:</IonLabel>
                          {vehicleColor !== '' ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setVehicleColor('') }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='filter-chip-100'>
                            <IonSelect class='filter-select-100' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={vehicleColor} onIonChange={e => setVehicleColor(e.detail.value!)}>
                              {colors.map(col => <IonSelectOption key={col} value={col}>{col}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Make / Model:</IonLabel>
                          {make !== '' ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setMake(''); setModelList([]) }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class={modelList.length !== 0 ? 'filter-chip' : 'filter-chip-100'}>
                            <IonSelect class={modelList.length !== 0 ? 'filter-select' : 'filter-select-100'} mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={make} onIonChange={e => { setMake(e.detail.value!); getModels(e.detail.value!) }}>
                              {makes.map(make => <IonSelectOption key={make} value={make}>{make}</IonSelectOption>)}
                            </IonSelect>
                          </IonChip>
                          {modelList.length !== 0 ?
                            <IonChip class='filter-chip'>
                              <IonSelect class='filter-select' mode='ios' interfaceOptions={customPopoverOptions} interface='popover' value={model} onIonChange={e => setModel(e.detail.value!)}>
                                {modelList.map(model => <IonSelectOption key={model} value={model}>{model}</IonSelectOption>)}
                              </IonSelect>
                            </IonChip>
                            : false}
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Rating:</IonLabel>
                          {ratingStart !== 0 ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setRatingStart(0); }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip class='center-buttons filter-chip-100'>
                            <IonButtons class='center-buttons filter-select-80'>
                              <IonButton onClick={() => setRatingStart(1)}>
                                <IonIcon icon={ratingStart > 0 ? star : starOutline} />
                              </IonButton>
                              <IonButton onClick={() => setRatingStart(2)}>
                                <IonIcon icon={ratingStart > 1 ? star : starOutline} />
                              </IonButton>
                              <IonButton onClick={() => setRatingStart(3)}>
                                <IonIcon icon={ratingStart > 2 ? star : starOutline} />
                              </IonButton>
                              <IonButton onClick={() => setRatingStart(4)}>
                                <IonIcon icon={ratingStart > 3 ? star : starOutline} />
                              </IonButton>
                              <IonButton onClick={() => setRatingStart(5)}>
                                <IonIcon icon={ratingStart > 4 ? star : starOutline} />
                              </IonButton>
                            </IonButtons>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonLabel>Powertrain:</IonLabel>
                          {ratingStart !== 0 ?
                            <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setRatingStart(0); }}>
                              <IonLabel>Clear</IonLabel>
                            </IonButton>
                            : false}
                        </IonItem>
                        <IonItem lines='none' class='anti-focus item-lines-none'>
                          <IonChip>
                            <IonCheckbox/>
                            <IonLabel>Electric</IonLabel>
                          </IonChip>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
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
            {curr_user === '' ?
              true
              :
              <IonRow>
                <IonCol>
                  <IonAccordionGroup>
                    <IonAccordion>
                      <IonItem slot="header">
                        <IonIcon slot='start' icon={starOutline}></IonIcon>
                        <IonLabel>Favorites</IonLabel>
                      </IonItem>
                      <IonList slot="content">
                        {favoritesList.length === 0 ?
                          <IonItem>
                            <IonLabel>No favorites</IonLabel>
                          </IonItem>
                          :
                          favoritesList?.map(v =>
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
                                  <IonCol>
                                    <IonButton onClick={() => handlePresentVehicle(v.id)}>View</IonButton>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonItem>
                          )}
                      </IonList>
                    </IonAccordion>
                  </IonAccordionGroup>
                </IonCol>
              </IonRow>}
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
            <Route path="/vehicles" render={() => (<VehiclesPage mainRef={mainRef} />)} exact />
            <Route path="/" render={() => <Redirect to="/vehicles" />} exact={true} />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
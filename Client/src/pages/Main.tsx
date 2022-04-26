import { IonPage, IonToolbar, IonTitle, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonMenu, IonHeader, IonContent, IonAccordionGroup, IonAccordion, IonList, IonButtons, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonButton, useIonModal, IonSelect, IonSelectOption, useIonPopover, IonFooter, IonChip, IonRange, IonInput, IonCheckbox, IonAvatar, IonItemDivider } from '@ionic/react';
import { optionsOutline, starOutline, removeCircleOutline, filterOutline, personOutline, closeOutline, starSharp, star, checkboxOutline, checkbox, stopOutline, atCircle, ellipseOutline, checkmarkCircleOutline, checkmarkCircle, power, carSport, carSportOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import VehiclesPage from './Vehicles';
import LoginModal from './Login';
import { capacities, capacityMax, capacityMin, clearStorage, colors, curr_priv, curr_pswd, curr_user, filter, makes, powertrainOptions, setFilter, setRefreshQuery, setResetQuery, transmissions, vehicleOptionOptions, vehicleTypeOptions, yearMax, yearMin, years } from '../components/StorageService';
import AddVehicle from './AddVehicle';
import AdminModal from './Admin';

import './Main.css';
import VehicleCard from './VehicleCard';

const Main: React.FC = () => {
  const mainRef = useRef();

  const [favoritesList, setFavoritesList] = useState<Array<any>>([]);
  const [requestsListBuyer, setRequestsListBuyer] = useState<Array<any>>([]);
  const [requestsListSeller, setRequestsListSeller] = useState<Array<any>>([]);
  const [updateState, setUpdateState] = useState(false);

  // Powertrain Filter
  const [powertrains, setPowertrains] = useState(powertrainOptions);
  const checkPowertrainsSet = () => {
    for (let i = 0; i < powertrains.length; i++) {
      if (powertrains[i].isChecked !== powertrainOptions[i].isChecked) {
        return true;
      }
    }
    return false;
  }
  const selectPowertrain = (type: string) => {
    setPowertrains(
      powertrains.map((pt) =>
        pt.type === type
          ? { ...pt, isChecked: pt.isChecked ? false : true }
          : { ...pt }
      )
    )
  }
  // Vehicle Type Filter
  const [vehicleTypes, setVehicleTypes] = useState(vehicleTypeOptions);
  const checkVehicleTypesSet = () => {
    for (let i = 0; i < vehicleTypes.length; i++) {
      if (vehicleTypes[i].isChecked !== vehicleTypeOptions[i].isChecked) {
        return true;
      }
    }
    return false;
  }
  const selectVehicleType = (type: string) => {
    setVehicleTypes(
      vehicleTypes.map((v) =>
        v.type === type
          ? { ...v, isChecked: v.isChecked ? false : true }
          : { ...v }
      )
    )
  }
  // Vehicle Options Filter
  const [vehicleOptions, setVehicleOptions] = useState(vehicleOptionOptions);
  const checkVehicleOptionsSet = () => {
    for (let i = 0; i < vehicleOptions.length; i++) {
      if (vehicleOptions[i].isChecked !== vehicleOptionOptions[i].isChecked) {
        return true;
      }
    }
    return false;
  }
  const selectVehicleOption = (type: string) => {
    setVehicleOptions(
      vehicleOptions.map((o) =>
        o.type === type
          ? { ...o, isChecked: o.isChecked ? false : true }
          : { ...o }
      )
    )
  }

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

  // Filter controller
  const updateFilter = () => {
    let vehicleOptionsSelected: Array<string> = [];
    vehicleOptions.map(vo => vo.isChecked ? vehicleOptionsSelected.push(vo.type) : false);

    let vehicleTypesSelected: Array<string> = [];
    vehicleTypes.map(vt => vt.isChecked ? vehicleTypesSelected.push(vt.type) : false);

    let powertrainsSelected: Array<string> = [];
    powertrains.map(p => p.isChecked ? powertrainsSelected.push(p.type) : false);

    const newFilter = {
      "year_start": yearStart !== yearMin ? yearStart : null,
      "year_end": yearEnd !== yearMax ? yearEnd : null,
      "price_start": priceStart !== 0 ? priceStart : null,
      "price_end": priceEnd !== 0 ? priceEnd : null,
      "capacity_start": capacityStart !== capacityMin ? capacityStart : null,
      "capacity_end": capacityEnd !== capacityMax ? capacityEnd : null,
      "mileage_start": mileageStart !== 0 ? mileageStart : null,
      "mileage_end": mileageEnd !== 0 ? mileageEnd : null,
      "transmission_type": transmissionType !== '' ? transmissionType : null,
      "vehicle_color": vehicleColor !== '' ? vehicleColor : null,
      "make": make !== '' ? make : null,
      "model": model !== '' ? model : null,
      "rating_start": ratingStart !== 0 ? ratingStart : null,
      "powertrains_list": checkPowertrainsSet() ? powertrainsSelected : null,
      "vehicle_types_list": checkVehicleTypesSet() ? vehicleTypesSelected : null,
      "vehicle_options_list": checkVehicleOptionsSet() ? vehicleOptionsSelected : null
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

  const getRequests = () => {
    fetch('https://api.kianm.net/index.php/payment/listBuyer', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRequestsListBuyer(result);
      })

      fetch('https://api.kianm.net/index.php/payment/listSeller', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRequestsListSeller(result);
      })
  }

  const cancelRequest = ($vehicle_id: number, buyer: string, seller: string) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/payment/cancel', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: '{"vehicle_id":' + $vehicle_id + ',"buyer":"' + buyer + '","seller":"' + seller + '"}'
    })
      .then(() => { getRequests() })
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
          <IonItem lines="full">
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
                setPowertrains(powertrainOptions);
                setVehicleTypes(vehicleTypeOptions);
                setVehicleOptions(vehicleOptionOptions);
              }}>
                Reset
              </IonButton>
            </IonButtons>
          </IonItem>
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
                      <IonButton onClick={() => setRatingStart(0.5)}>
                        <IonIcon icon={ratingStart >= 0.5 ? star : starOutline} />
                      </IonButton>
                      <IonButton onClick={() => setRatingStart(1.5)}>
                        <IonIcon icon={ratingStart >= 1.5 ? star : starOutline} />
                      </IonButton>
                      <IonButton onClick={() => setRatingStart(2.5)}>
                        <IonIcon icon={ratingStart >= 2.5 ? star : starOutline} />
                      </IonButton>
                      <IonButton onClick={() => setRatingStart(3.5)}>
                        <IonIcon icon={ratingStart >= 3.5 ? star : starOutline} />
                      </IonButton>
                      <IonButton onClick={() => setRatingStart(4.5)}>
                        <IonIcon icon={ratingStart >= 4.5 ? star : starOutline} />
                      </IonButton>
                    </IonButtons>
                  </IonChip>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size='12'>
                <IonItem lines='none' class='anti-focus item-lines-none'>
                  <IonLabel>Powertrain:</IonLabel>
                  {checkPowertrainsSet() ?
                    <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setPowertrains(powertrainOptions); }}>
                      <IonLabel>Clear</IonLabel>
                    </IonButton>
                    : false}
                </IonItem>
              </IonCol>
              {powertrains.map((pt) =>
                <IonCol key={pt.type}>
                  <IonItem lines='none' class='anti-focus item-lines-none'>
                    <IonChip onClick={() => selectPowertrain(pt.type)}>
                      <IonIcon icon={pt.isChecked ? checkmarkCircle : ellipseOutline} color='primary' />
                      <IonLabel>{pt.type}</IonLabel>
                    </IonChip>
                  </IonItem>
                </IonCol>
              )}
            </IonRow>
            <IonRow>
              <IonCol size='12'>
                <IonItem lines='none' class='anti-focus item-lines-none'>
                  <IonLabel>Vehicle Type:</IonLabel>
                  {checkVehicleTypesSet() ?
                    <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setVehicleTypes(vehicleTypeOptions); }}>
                      <IonLabel>Clear</IonLabel>
                    </IonButton>
                    : false}
                </IonItem>
              </IonCol>
              {vehicleTypes.map((v) =>
                <IonCol key={v.type}>
                  <IonItem lines='none' class='anti-focus item-lines-none'>
                    <IonChip onClick={() => selectVehicleType(v.type)}>
                      <IonIcon icon={v.isChecked ? checkmarkCircle : ellipseOutline} color='primary' />
                      <IonLabel>{v.type}</IonLabel>
                    </IonChip>
                  </IonItem>
                </IonCol>
              )}
            </IonRow>
            <IonRow>
              <IonCol size='12'>
                <IonItem lines='none' class='anti-focus item-lines-none'>
                  <IonLabel>Vehicle Options:</IonLabel>
                  {checkVehicleOptionsSet() ?
                    <IonButton slot='end' size='small' color='primary' fill='clear' onClick={() => { setVehicleOptions(vehicleOptionOptions); }}>
                      <IonLabel>Clear</IonLabel>
                    </IonButton>
                    : false}
                </IonItem>
              </IonCol>
              {vehicleOptions.map((o) =>
                <IonCol key={o.type}>
                  <IonItem lines='none' class='anti-focus item-lines-none'>
                    <IonChip onClick={() => selectVehicleOption(o.type)}>
                      <IonIcon icon={o.isChecked ? checkmarkCircle : ellipseOutline} color='primary' />
                      <IonLabel>{o.type}</IonLabel>
                    </IonChip>
                  </IonItem>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonMenu>
      <IonMenu id='accountMenu' side='end' contentId='outlet' onIonDidOpen={() => { if (curr_user !== '') { getFavorites(); getRequests() } }}>
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
                <IonCol>
                  <IonAccordionGroup>
                    <IonAccordion>
                      <IonItem slot="header">
                        <IonIcon slot='start' icon={carSportOutline}></IonIcon>
                        <IonLabel>Your Requests</IonLabel>
                      </IonItem>
                      <IonList slot="content">
                        {requestsListBuyer.length === 0 ?
                          <IonItem>
                            <IonLabel>No requests</IonLabel>
                          </IonItem>
                          :
                          requestsListBuyer?.map(r =>
                            <IonItem key={r.id}>
                              <IonGrid>
                                <IonRow>
                                  <IonCol>Seller:</IonCol>
                                  <IonCol>{r.buyer}</IonCol>
                                  <IonCol>Status:</IonCol>
                                  <IonCol>{r.status}</IonCol>
                                  <IonCol>
                                    <IonButton onClick={() => cancelRequest(r.vehicle_id, r.buyer, r.seller)}>
                                      <IonIcon slot='icon-only' icon={removeCircleOutline} />
                                    </IonButton>
                                  </IonCol>
                                  <IonCol>
                                    <IonButton onClick={() => handlePresentVehicle(r.vehicle_id)}>View</IonButton>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonItem>
                          )}
                      </IonList>
                    </IonAccordion>
                  </IonAccordionGroup>
                </IonCol>
                <IonCol>
                  <IonAccordionGroup>
                    <IonAccordion>
                      <IonItem slot="header">
                        <IonIcon slot='start' icon={carSportOutline}></IonIcon>
                        <IonLabel>Renters / Buyers</IonLabel>
                      </IonItem>
                      <IonList slot="content">
                        {requestsListSeller.length === 0 ?
                          <IonItem>
                            <IonLabel>No requests</IonLabel>
                          </IonItem>
                          :
                          requestsListSeller?.map(r =>
                            <IonItem key={r.id}>
                              <IonGrid>
                                <IonRow>
                                  <IonCol>Buyer:</IonCol>
                                  <IonCol>{r.buyer}</IonCol>
                                  <IonCol>Status:</IonCol>
                                  <IonCol>{r.status}</IonCol>
                                  <IonCol>
                                    <IonButton onClick={() => cancelRequest(r.vehicle_id, r.buyer, r.seller)}>
                                      <IonIcon slot='icon-only' icon={removeCircleOutline} />
                                    </IonButton>
                                  </IonCol>
                                  <IonCol>
                                    <IonButton onClick={() => handlePresentVehicle(r.vehicle_id)}>View</IonButton>
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
              }
          </IonGrid>
        </IonContent>
        {curr_user !== '' ?
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
          : false}
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
          </IonTabBar>
          <IonRouterOutlet>
            <Route path="/vehicles" render={() => (<VehiclesPage mainRef={mainRef} />)} exact />
            <Route path="/" render={() => <Redirect to="/vehicles" />} exact={true} />
          </IonRouterOutlet>
        </IonTabs>
      </IonContent>
    </IonPage>
  )
}

export default Main;
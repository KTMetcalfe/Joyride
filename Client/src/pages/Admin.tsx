import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar, useIonActionSheet } from "@ionic/react"
import { addCircleOutline, checkmarkCircle, removeCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { curr_user, curr_pswd, setRefreshQuery } from "../components/StorageService";

import './Modal.css';

// Admin page for checking and approving/denying vehicle submissions 
const AdminPage: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  // State variables for loading vehicles
  const [busy, setBusy] = useState(true);
  const [list, setList] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

  // Waits for component to be mounted
  const [waiting, setWaiting] = useState(true);

  // Validates the current vehicle submission list
  const checkList = async () => {
    return await fetch('https://api.kianm.net/index.php/vehicles/list?admin=true', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(list)
    })
  }

  // Gets a specified number of vehicles pages off the given list
  const getVehicles = (currList: Array<any>, limit: number) => {
    fetch('https://api.kianm.net/index.php/vehicles/list?admin=true&offset=' + currList.length + '&limit=' + limit, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(newList => {
        setList([
          ...currList,
          ...newList
        ])
      })
  }

  // Updates list by specified amount after verifying
  const updateList = (limit: number) => {
    if (list.length > 0) {
      checkList()
        .then(e => e.json())
        .then(safeList => {
          getVehicles(safeList, limit);
        })
    } else {
      getVehicles(list, limit);
    }
  }

  // Runs on inifinite scroll, adds 10 vehicles to the list
  const reloadList = (ev: any) => {
    setTimeout(() => {
      updateList(10);
      ev.target.complete();
      if (list.length >= 1000) {
        setIsInfiniteDisabled(true);
      }
    }, 500)
  }

  // Runs every state change to (busy, update)
  useEffect(() => {
    let isMounted = true;

    // Cancels running if no longer mounted
    setWaiting(true);
    if (waiting) {
      let timer = setTimeout(() => {
        if (isMounted) {
          setWaiting(false);
        }
        clearTimeout(timer);
      }, 2500)
    }

    updateList(20);

    setBusy(false);
    setUpdate(false);

    return () => { isMounted = false }
    // eslint-disable-next-line
  }, [busy, update])

  // Approves selected vehicle submission
  const approveVehicle = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/vehicles/approve', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":"' + $id + '"}'
    })
      .then(e => e.json())
      .then(result => {
        if (result.approved === true) {
          console.log(result);
        }
        setUpdate(true);
      })
  }

  // Removes selected vehicle submission
  const removeVehicle = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/vehicles/remove', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":"' + $id + '"}'
    })
      .then(e => e.json())
      .then(result => {
        if (result.removed === true) {
          console.log(result);
        }
        setUpdate(true);
      })
  }

  // Presents alert before removing vehicle
  const [presentRemove, dismissRemove] = useIonActionSheet();
  const handlePresentRemove = (vehicle_id: number) => {
    presentRemove({
      buttons: [
        {
          text: "Remove",
          handler: () => removeVehicle(vehicle_id)
        },
        { text: "Cancel" }
      ],
      header: "Remove vehicle?",
      mode: "ios"
    });
  }

  // React components
  return busy ? <IonSpinner /> : (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Admin</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={true}>
        {list?.length === 0 ?
          <div className="true-center">
            {waiting ?
              <IonSpinner />
              :
              <IonCard>
                <IonCardContent>
                  <IonLabel class="ion-text-center">No Unapproved Vehicles</IonLabel>
                </IonCardContent>
              </IonCard>}
          </div>
          :
          <IonGrid>
            <IonRow>
              {list?.map(v =>
                <IonCol key={v.id}>
                  <IonCard key={v.id} mode="ios">
                    <IonCardHeader>
                      <IonCardSubtitle>Vehicle</IonCardSubtitle>
                      <IonCardTitle>{v.model_year} {v.make} {v.model}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {v.images === undefined || JSON.parse(v.images).length === 0 ?
                        <IonLabel className="swiper-main">No Image Found</IonLabel>
                        :
                        <Swiper slidesPerView='auto' className="swiper-main">
                          {JSON.parse(v.images).map((i: number) =>
                            <SwiperSlide key={i}>
                              <IonCard className='swiper-card' mode="ios">
                                <img alt={v.id + '-' + i + '.jpg'} src={'https://api.kianm.net/files/vehicle_images/' + v.id + '-' + i + '.jpg'} />
                              </IonCard>
                            </SwiperSlide>
                          )}
                        </Swiper>
                      }
                      <IonGrid>
                        <IonRow>
                          <IonCol size="12">
                            <IonLabel color="primary">Description:</IonLabel>
                          </IonCol>
                          <IonCol size="12">
                            <IonText class="ion-text-wrap">{v.description}</IonText>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Price: </IonLabel>
                            <IonLabel>{v.price}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Mileage: </IonLabel>
                            <IonLabel>{v.mileage}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Powertrain: </IonLabel>
                            <IonLabel>{v.powertrain}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Color: </IonLabel>
                            <IonLabel>{v.color}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Capacity: </IonLabel>
                            <IonLabel>{v.capacity}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">User: </IonLabel>
                            <IonLabel>{v.user}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Transmission: </IonLabel>
                            <IonLabel>{v.transmission}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Vehicle Type: </IonLabel>
                            <IonLabel>{v.vehicle_type}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          {typeof (v.vehicle_options) === "string" && v.vehicle_options !== '' ?
                            JSON.parse(v.vehicle_options).map((o: string) =>
                              <IonCol key={o}>
                                <IonChip class="options-chip">
                                  <IonIcon icon={checkmarkCircle} color='primary' />
                                  <IonLabel>{o}</IonLabel>
                                </IonChip>
                              </IonCol>
                            ) : false}
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            <IonButton expand="block" color="primary" onClick={() => approveVehicle(v.id)}>
                              <IonIcon slot='icon-only' icon={addCircleOutline} />
                            </IonButton>
                          </IonCol>
                          <IonCol>
                            <IonButton expand="block" color="danger" onClick={e => {handlePresentRemove(v.id); e.stopPropagation()}}>
                              <IonIcon slot='icon-only' icon={removeCircleOutline} />
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        }
        <IonInfiniteScroll
          onIonInfinite={reloadList}
          threshold="0px"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Grabbing the keys..."
          >
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  )
}

export default AdminPage;
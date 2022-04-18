import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { addCircleOutline, removeCircleOutline, star, starOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { curr_user, curr_pswd, setRefreshQuery } from "../components/StorageService";

import './Modal.css';

const AdminPage: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [busy, setBusy] = useState(true);
  const [list, setList] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

  const [waiting, setWaiting] = useState(true);

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

  const reloadList = (ev: any) => {
    setTimeout(() => {
      updateList(10);
      ev.target.complete();
      if (list.length >= 1000) {
        setIsInfiniteDisabled(true);
      }
    }, 500)
  }

  useEffect(() => {
    let isMounted = true;

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
                          <IonCol size="6">
                            <IonLabel color="primary">Price: </IonLabel>
                            <IonLabel>{v.price}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Mileage: </IonLabel>
                            <IonLabel>{v.mileage}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">Capacity: </IonLabel>
                            <IonLabel>{v.capacity}</IonLabel>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel color="primary">User: </IonLabel>
                            <IonLabel>{v.user}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="6">
                            <IonButtons class='center-buttons'>
                              <IonButton disabled={curr_user === ''}>
                                <IonIcon icon={v.rating >= .5 ? star : starOutline} />
                              </IonButton>
                              <IonButton disabled={curr_user === ''}>
                                <IonIcon icon={v.rating >= 1.5 ? star : starOutline} />
                              </IonButton>
                              <IonButton disabled={curr_user === ''}>
                                <IonIcon icon={v.rating >= 2.5 ? star : starOutline} />
                              </IonButton>
                              <IonButton disabled={curr_user === ''}>
                                <IonIcon icon={v.rating >= 3.5 ? star : starOutline} />
                              </IonButton>
                              <IonButton disabled={curr_user === ''}>
                                <IonIcon icon={v.rating >= 4.5 ? star : starOutline} />
                              </IonButton>
                            </IonButtons>
                          </IonCol>
                          <IonCol>
                            <IonButtons class="center-buttons">
                              <IonButton onClick={() => approveVehicle(v.id)}>
                                <IonIcon slot='icon-only' icon={addCircleOutline} />
                              </IonButton>
                            </IonButtons>
                          </IonCol>
                          <IonCol>
                            <IonButtons class="center-buttons">
                              <IonButton onClick={() => removeVehicle(v.id)}>
                                <IonIcon slot='icon-only' icon={removeCircleOutline} />
                              </IonButton>
                            </IonButtons>
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
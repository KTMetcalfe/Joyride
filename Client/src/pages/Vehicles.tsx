import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonPage, IonRow, IonSpinner, useIonModal } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline, star, starOutline } from "ionicons/icons";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, curr_priv, baseFilter, filter, refreshQuery, setRefreshQuery, resetQuery, setResetQuery } from "../components/StorageService";
import VehicleCard from "./VehicleCard";
import { Swiper, SwiperSlide } from 'swiper/react';

import './Modal.css';

const Vehicles: React.FC<{ mainRef: any }> = ({ mainRef }) => {
  const [busy, setBusy] = useState(true);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState<Array<any>>([]);
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const [ratings, setRatings] = useState<Array<any>>([]);

  const [waiting, setWaiting] = useState(true);

  const checkList = async () => {
    return await fetch('https://api.kianm.net/index.php/vehicles/list', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(list)
    })
  }

  const getVehicles = (currList: Array<any>, limit: number) => {
    // Changes fetch if filter is set
    (JSON.stringify(filter) !== JSON.stringify(baseFilter) ?
      fetch('https://api.kianm.net/index.php/vehicles/list?offset=' + currList.length + '&limit=' + limit, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
      })
      :
      fetch('https://api.kianm.net/index.php/vehicles/list?offset=' + currList.length + '&limit=' + limit, {
        method: 'GET',
        mode: 'cors'
      })
    )
      .then(e => e.json())
      .then(newList => {
        console.log(currList);
        console.log(newList);
        if (curr_user !== '' && curr_pswd !== '') {
          getFavorites();
          getRatings();
        }
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

  const getFavorites = async () => {
    await fetch('https://api.kianm.net/index.php/account/favorites', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setFavorites(result)
      })
  }

  const getRatings = async () => {
    await fetch('https://api.kianm.net/index.php/account/ratings', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRatings(result)
      })
  }

  const submitRating = async (id: number, rating: number) => {
    await fetch('https://api.kianm.net/index.php/vehicles/submitRating', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: JSON.stringify({
        "id": id,
        "rating": rating
      })
    })
      .then(e => getRatings())
  }

  const removeRating = async (id: number) => {
    await fetch('https://api.kianm.net/index.php/vehicles/removeRating', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: JSON.stringify({
        "id": id
      })
    })
      .then(e => refreshList())
  }

  const refreshList = () => {
    if (list.length > 0) {
      checkList()
        .then(e => e.json())
        .then(safeList => {
          getVehicles([], safeList.length);
        })
    }
  }

  useEffect(() => {
    setWaiting(true);
    if (waiting) {
      let timer = setTimeout(() => {
        setWaiting(false);
        clearTimeout(timer);
      }, 2500)
    }

    if (resetQuery) {
      setList([]);

      setResetQuery(false);
    } else {
      updateList(20);

      setBusy(false);
      setUpdate(false);
      setRefreshQuery(false);
    }

    // eslint-disable-next-line
  }, [busy, update, refreshQuery, resetQuery])

  const addFavorite = ($id: number) => {
    fetch('https://api.kianm.net/index.php/account/addFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  const removeFavorite = ($id: number) => {
    fetch('https://api.kianm.net/index.php/account/removeFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  const removeVehicle = ($id: number) => {
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

  return busy ? <IonSpinner /> : (
    <IonPage>
      <IonContent forceOverscroll={true}>
        {list?.length === 0 ?
          <div className="true-center">
            {waiting ?
              <IonSpinner />
              :
              <IonCard>
                <IonCardContent>
                  <IonLabel class="ion-text-center">No Vehicles Found</IonLabel>
                </IonCardContent>
              </IonCard>}
          </div>
          :
          <IonGrid>
            <IonRow>
              {list?.map(v =>
                <IonCol key={v.id} size='12' size-xl='3' size-lg='4' size-md='6'>
                  <IonCard key={v.id} onClick={() => { handlePresentVehicle(v.id) }} mode='ios'>
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
                          <IonCol>
                            <IonLabel>Price: </IonLabel>
                            <IonLabel>{v.price}</IonLabel>
                          </IonCol>
                          <IonCol>
                            <IonLabel>Mileage: </IonLabel>
                            <IonLabel>{v.mileage}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            <IonLabel>Capacity: </IonLabel>
                            <IonLabel>{v.capacity}</IonLabel>
                          </IonCol>
                          <IonCol>
                            <IonLabel>User: </IonLabel>
                            <IonLabel>{v.user}</IonLabel>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size={curr_user !== '' ? "7" : "12"}>
                            {ratings.find(r => r.id === v.id) !== undefined ?
                              <IonButtons class='center-buttons'>
                                <IonButton color="tertiary" onClick={e => { removeRating(v.id); e.stopPropagation() }}>
                                  <IonIcon icon={ratings.find(r => r.id === v.id).rating >= .5 ? star : starOutline} />
                                </IonButton>
                                <IonButton color="tertiary" onClick={e => { removeRating(v.id); e.stopPropagation() }}>
                                  <IonIcon icon={ratings.find(r => r.id === v.id).rating >= 1.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton color="tertiary" onClick={e => { removeRating(v.id); e.stopPropagation() }}>
                                  <IonIcon icon={ratings.find(r => r.id === v.id).rating >= 2.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton color="tertiary" onClick={e => { removeRating(v.id); e.stopPropagation() }}>
                                  <IonIcon icon={ratings.find(r => r.id === v.id).rating >= 3.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton color="tertiary" onClick={e => { removeRating(v.id); e.stopPropagation() }}>
                                  <IonIcon icon={ratings.find(r => r.id === v.id).rating >= 4.5 ? star : starOutline} />
                                </IonButton>
                              </IonButtons>
                              :
                              <IonButtons class='center-buttons'>
                                <IonButton disabled={curr_user === ''} onClick={e => { submitRating(v.id, 1); e.stopPropagation() }}>
                                  <IonIcon icon={v.rating >= .5 ? star : starOutline} />
                                </IonButton>
                                <IonButton disabled={curr_user === ''} onClick={e => { submitRating(v.id, 2); e.stopPropagation() }}>
                                  <IonIcon icon={v.rating >= 1.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton disabled={curr_user === ''} onClick={e => { submitRating(v.id, 3); e.stopPropagation() }}>
                                  <IonIcon icon={v.rating >= 2.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton disabled={curr_user === ''} onClick={e => { submitRating(v.id, 4); e.stopPropagation() }}>
                                  <IonIcon icon={v.rating >= 3.5 ? star : starOutline} />
                                </IonButton>
                                <IonButton disabled={curr_user === ''} onClick={e => { submitRating(v.id, 5); e.stopPropagation() }}>
                                  <IonIcon icon={v.rating >= 4.5 ? star : starOutline} />
                                </IonButton>
                              </IonButtons>
                            }
                          </IonCol>
                          {curr_user !== '' ?
                            <IonCol size="4">
                              <IonButtons class='center-buttons'>
                                <IonButton onClick={e => { favorites?.filter(d => d.id === v.id).length === 1 ? removeFavorite(v.id) : addFavorite(v.id); e.stopPropagation() }} size='small' fill='clear' color='primary'>
                                  <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === v.id).length === 1 ? heart : heartOutline} />
                                </IonButton>
                              </IonButtons>
                            </IonCol>
                            : false}
                          {curr_priv >= 1 ?
                            <IonCol size="1">
                              <IonButtons class='center-buttons'>
                                <IonButton onClick={e => { removeVehicle(v.id); e.stopPropagation() }} size='small' fill='clear' color='danger'>
                                  <IonIcon slot='icon-only' icon={removeCircleOutline} />
                                </IonButton>
                              </IonButtons>
                            </IonCol>
                            : false}
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

export default Vehicles;
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonList, IonPage, IonRow, IonSpinner, useIonModal } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline } from "ionicons/icons";
import React from "react";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, curr_priv, filter, refreshQuery, setRefreshQuery, resetQuery, setResetQuery } from "../components/StorageService";
import VehicleCard from "./VehicleCard";

const Vehicles: React.FC<{ mainRef: any }> = ({ mainRef }) => {
  const [busy, setBusy] = useState(true);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState<Array<any>>([]);
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

  const baseFilter = {
    "year_start": '',
    "year_end": ''
  };

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
        if (curr_user !== '' && curr_pswd !== '') {
          getFavorites();
        }
        setList([
          ...list,
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

  useEffect(() => {
    if (busy || update || refreshQuery || resetQuery || JSON.stringify(list) === JSON.stringify([])) {
      if (resetQuery) {
        setList([]);

        setResetQuery(false);
      } else {
        updateList(20);

        setBusy(false);
        setUpdate(false);
        setRefreshQuery(false);
      }
    }
  }, [busy, update, refreshQuery, resetQuery, list])

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
        <IonList class='trans-background' mode='ios'>
          {list?.map(v =>
            <IonCard key={v.id} onClick={() => { handlePresentVehicle(v.id) }}>
              <IonCardHeader>
                <IonCardSubtitle>Vehicle</IonCardSubtitle>
                <IonCardTitle>{v.model_year} {v.make} {v.model}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
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
                    <IonCol />
                    <IonCol />
                    {curr_user !== '' ?
                      <IonCol>
                        <IonButtons class='center-buttons'>
                          <IonButton onClick={e => { favorites?.filter(d => d.id === v.id).length === 1 ? removeFavorite(v.id) : addFavorite(v.id); e.stopPropagation() }} size='small' fill='clear' color='primary'>
                            <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === v.id).length === 1 ? heart : heartOutline} />
                          </IonButton>
                        </IonButtons>
                      </IonCol>
                      : false}
                    {curr_priv >= 1 ?
                      <IonCol>
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
          )}
        </IonList>
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
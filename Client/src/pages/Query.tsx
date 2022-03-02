import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItemDivider, IonLabel, IonList, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline } from "ionicons/icons";
import React from "react";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, curr_priv, setRefresh, refresh } from "../components/StorageService";

const Query: React.FC = () => {
  const [busy, setBusy] = useState(true);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState<Array<any>>([]);
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

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

  const updateList = (limit: number) => {
    if (list.length > 0) {
      checkList()
        .then(e => e.json())
        .then(safeList => {
          fetch('https://api.kianm.net/index.php/vehicles/list?offset=' + safeList.length + '&limit=' + limit, {
            method: 'GET',
            mode: 'cors'
          })
            .then(e => e.json())
            .then(newList => {
              if (curr_user !== '' && curr_pswd !== '') {
                getFavorites();
              }
              setList([
                ...safeList,
                ...newList
              ])
            })
        })
    } else {
      fetch('https://api.kianm.net/index.php/vehicles/list?offset=' + list.length + '&limit=' + limit, {
        method: 'GET',
        mode: 'cors'
      })
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
    // if (busy || refresh || update) {
    //   fetch('https://api.kianm.net/index.php/vehicles/list', {
    //     method: 'GET',
    //     mode: 'cors'
    //   })
    //     .then(e => e.json())
    //     .then(result => {
    //       if (curr_user !== '' && curr_pswd !== '') {
    //         getFavorites();
    //       }
    //       setList(result);
    //       setBusy(false);
    //     })
    //   setUpdate(false);
    //   setRefresh(false);
    // }
    updateList(20);
    setBusy(false);
    setUpdate(false);
    setRefresh(false);
  }, [busy, update, refresh])

  const addFavorite = ($id: number) => {
    fetch('https://api.kianm.net/index.php/account/addFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
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
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
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

  return busy ? <IonSpinner /> : (
    <IonPage>
      <IonContent forceOverscroll={true}>
        <IonList>
          {list?.map(v =>
            <IonCard key={v.id}>
              <IonCardHeader>
                <IonCardSubtitle>Vehicle</IonCardSubtitle>
                <IonCardTitle>{v.model_year} {v.make} {v.model}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid color='danger'>
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
                          <IonButton onClick={() => { favorites?.filter(e => e.id === v.id).length === 1 ? removeFavorite(v.id) : addFavorite(v.id) }} size='small' fill='clear' color='primary'>
                            <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === v.id).length === 1 ? heart : heartOutline} />
                          </IonButton>
                        </IonButtons>
                      </IonCol>
                      : false}
                    {curr_priv >= 1 ?
                      <IonCol>
                        <IonButtons class='center-buttons'>
                          <IonButton onClick={() => removeVehicle(v.id)} size='small' fill='clear' color='danger'>
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

export default Query;
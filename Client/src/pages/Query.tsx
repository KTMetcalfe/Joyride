import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonLabel, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline } from "ionicons/icons";
import React from "react";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, curr_priv, setRefresh, refresh } from "../components/StorageService";

const Query: React.FC = () => {
  const [busy, setBusy] = useState(true);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState<Array<any>>();
  const [favorites, setFavorites] = useState<Array<any>>();

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
    if (busy || refresh || update) {
      fetch('https://api.kianm.net/index.php/vehicles/list', {
        method: 'GET',
        mode: 'cors'
      })
        .then(e => e.json())
        .then(result => {
          getFavorites().then(() => {
            setList(result);
            setBusy(false);
          });
        })
      setUpdate(false);
      setRefresh(false);
    }
  })


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
      <IonContent>
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
                  <IonCol>
                    <IonButtons class='center-buttons'>
                      <IonButton onClick={() => addFavorite(v.id)} size='small' fill='clear' color='primary'>
                        <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === v.id).length === 1 ? heart : heartOutline} />
                      </IonButton>
                    </IonButtons>
                  </IonCol>
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
      </IonContent>
    </IonPage>
  )
}

export default Query;
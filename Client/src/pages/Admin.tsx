import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import { addCircleOutline, heart, heartOutline, removeCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, setRefreshQuery, curr_priv } from "../components/StorageService";

import './Modal.css'

const AdminPage: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [busy, setBusy] = useState(true);
  const [list, setList] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);

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

  const updateList = (limit: number) => {
    if (list.length > 0) {
      checkList()
        .then(e => e.json())
        .then(safeList => {
          fetch('https://api.kianm.net/index.php/vehicles/list?admin=true&offset=' + safeList.length + '&limit=' + limit, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
            }
          })
            .then(e => e.json())
            .then(newList => {
              setList([
                ...safeList,
                ...newList
              ])
            })
        })
    } else {
      fetch('https://api.kianm.net/index.php/vehicles/list?admin=true&offset=' + list.length + '&limit=' + limit, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
        }
      })
        .then(e => e.json())
        .then(newList => {
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

  useEffect(() => {
    // fetch('https://api.kianm.net/index.php/vehicles/list?admin=true', {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: {
    //     'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
    //   }
    // })
    //   .then(e => e.json())
    //   .then(result => {
    //     setList(result);
    //     setBusy(false);
    //   })
    //   setUpdate(false);
    updateList(20);
    setBusy(false);
    setUpdate(false);
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
        <IonList class='trans-background' mode='ios'>
          <IonListHeader>
            <IonLabel class='ion-text-center'>Vehicles</IonLabel>
          </IonListHeader>
          {list?.map(v =>
            <IonCard key={v.id}>
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

export default AdminPage;
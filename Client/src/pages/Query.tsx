import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { heartOutline, removeCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, setCurrentAccount, onLoad, curr_priv } from "../components/StorageService";

const Query: React.FC = () => {
  const [busy, setBusy] = useState(true);
  const [list, setList] = useState(Array<any>());

  useEffect(() => {
    fetch('https://api.kianm.net/index.php/vehicles/list', {
      method: 'GET',
      mode: 'cors'
    })
      .then(e => e.json())
      .then(result => {
        setList(result);
        setBusy(false);
      })
  })

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
      })
  }

  return busy ? <IonSpinner /> : (
    <IonPage>
      <IonContent>
        <IonList inset={true}>
          <IonListHeader>
            <IonLabel class='ion-text-center'>Vehicles</IonLabel>
          </IonListHeader>
          {list.map(v =>
            <IonItem key={v.id}>
              <IonGrid>
                <IonRow>
                  <IonCol>Make:</IonCol>
                  <IonCol>{v.make}</IonCol>
                  <IonCol>Model:</IonCol>
                  <IonCol>{v.model}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Mileage:</IonCol>
                  <IonCol>{v.mileage}</IonCol>
                  <IonCol>Price:</IonCol>
                  <IonCol>{v.price}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>Year:</IonCol>
                  <IonCol>{v.model_year}</IonCol>
                  <IonCol>Capacity:</IonCol>
                  <IonCol>{v.capacity}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>User:</IonCol>
                  <IonCol>{v.user}</IonCol>
                  <IonCol>
                    <IonButton>
                      <IonIcon slot='icon-only' icon={heartOutline} />
                    </IonButton>
                  </IonCol>
                  {curr_priv >= 1 ?
                    <IonCol>
                      <IonButton onClick={() => removeVehicle(v.id)}>
                        <IonIcon slot='icon-only' icon={removeCircleOutline} />
                      </IonButton>
                    </IonCol>
                    : false}
                </IonRow>
              </IonGrid>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Query;
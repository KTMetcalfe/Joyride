import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import { addCircleOutline, heartOutline, removeCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd, setRefresh } from "../components/StorageService";

const AdminPage: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [busy, setBusy] = useState(true);
  const [list, setList] = useState<Array<any>>();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetch('https://api.kianm.net/index.php/vehicles/list?admin=true', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setList(result);
        setBusy(false);
      })
  }, [busy, update])

  const approveVehicle = ($id: number) => {
    setRefresh(true);
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
    setRefresh(true);
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
      <IonContent>
        <IonList inset={true}>
          <IonListHeader>
            <IonLabel class='ion-text-center'>Vehicles</IonLabel>
          </IonListHeader>
          {list?.map(v =>
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
                    <IonButton onClick={() => approveVehicle(v.id)}>
                      <IonIcon slot='icon-only' icon={addCircleOutline} />
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton onClick={() => removeVehicle(v.id)}>
                      <IonIcon slot='icon-only' icon={removeCircleOutline} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default AdminPage;
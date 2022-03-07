import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react"
import { addCircleOutline, image } from "ionicons/icons";
import { useState } from "react";
import { curr_pswd, curr_user } from "../components/StorageService";

import './Modal.css'

const AddVehicle: React.FC<{ onDismiss: () => void; }> = ({ onDismiss }) => {
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');

  const checkAdd = () => {
    window.document.getElementById('add-output')!.style.display = "none";
    window.document.getElementById('addErr')!.innerHTML = "";

    var input: any = window.document.getElementById('image-input');
    let images = input.files;

    let formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== undefined) {
        formData.append('image-' + i, images[i]);
      }
    }
    formData.append("make", make);
    formData.append("model", model);
    formData.append("mileage", mileage);
    formData.append("price", price);
    formData.append("year", year);
    formData.append("capacity", capacity);

    fetch('https://api.kianm.net/index.php/vehicles/add', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: formData
    })
      .then(e => e.json())
      .then(result => {
        if (result.added === true) {
          window.document.getElementById('addErr')!.innerHTML = "Vehicle added";
          window.document.getElementById('add-output')!.style.display = "block";
          onDismiss();
        }
        console.log(result)
      })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Add Vehicle</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false}>
        <div className="form-pane">
          <IonGrid class="form-grid">
            <IonRow>
              <IonCol>
                <IonList class='form-input'>
                  <IonItem>
                    <IonInput value={make} placeholder="Make" onIonChange={e => setMake(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput value={model} placeholder="Model" onIonChange={e => setModel(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={mileage} placeholder="Mileage" onIonChange={e => setMileage(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={price} placeholder="Price" onIonChange={e => setPrice(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={year} placeholder="Year" onIonChange={e => setYear(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={capacity} placeholder="Capacity" onIonChange={e => setCapacity(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <input type='file' id='image-input' />
                  </IonItem>
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem id='add-output'>
                  <IonLabel id='addErr' class='ion-text-center'></IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton color="secondary" expand="block" onClick={() => {
                  if (make !== '' && model !== '' && mileage !== '' && price !== '' && year !== '' && capacity !== '') {
                    if (!isNaN(Number(mileage)) && !isNaN(Number(price)) && !isNaN(Number(year)) && !isNaN(Number(capacity))) {
                      checkAdd()
                    } else {
                      window.document.getElementById('add-output')!.style.display = "block";
                      window.document.getElementById('addErr')!.innerHTML = "Please enter valid numbers";
                    }
                  } else {
                    window.document.getElementById('add-output')!.style.display = "block";
                    window.document.getElementById('addErr')!.innerHTML = "Please enter all information";
                  }
                }}>
                  <IonIcon slot='icon-only' icon={addCircleOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AddVehicle;
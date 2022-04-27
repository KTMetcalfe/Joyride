import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react"
import { addCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { curr_pswd, curr_user, powertrainOptions, transmissions, vehicleOptionOptions, vehicleTypeOptions } from "../components/StorageService";

import './Modal.css';

const AddVehicle: React.FC<{ onDismiss: () => void; }> = ({ onDismiss }) => {
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [powertrain, setPowertrain] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [vehicleOptions, setVehicleOptions] = useState<object>([]);
  const [description, setDescription] = useState<string>('');
  const [rentPrice, setRentPrice] = useState<string>('');

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
    formData.append("transmission_type", transmission);
    formData.append("vehicle_color", color);
    formData.append("powertrain", powertrain);
    formData.append("vehicle_type", vehicleType);
    formData.append("vehicle_options_list", JSON.stringify(vehicleOptions));
    formData.append("description", description);
    formData.append("rent_price", rentPrice);

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
                    <IonInput type="number" value={rentPrice} placeholder="Rent Price" onIonChange={e => setRentPrice(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={year} placeholder="Year" onIonChange={e => setYear(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="number" value={capacity} placeholder="Capacity" onIonChange={e => setCapacity(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonInput type="text" value={color} placeholder="Color" onIonChange={e => setColor(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonSelect mode='ios' interface='popover' value={transmission} placeholder='Transmission' onIonChange={e => setTransmission(e.detail.value!)}>
                      {transmissions.map(t => <IonSelectOption key={t} value={t}>{t}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonSelect mode='ios' interface='popover' value={powertrain} placeholder='Powertrain' onIonChange={e => setPowertrain(e.detail.value!)}>
                      {powertrainOptions.map(p => <IonSelectOption key={p.type} value={p.type}>{p.type}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonSelect mode='ios' interface='popover' value={vehicleType} placeholder='Vehicle Type' onIonChange={e => setVehicleType(e.detail.value!)}>
                      {vehicleTypeOptions.map(vt => <IonSelectOption key={vt.type} value={vt.type}>{vt.type}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonSelect multiple mode='ios' interface='popover' value={vehicleOptions} placeholder='Options' onIonChange={e => setVehicleOptions(e.detail.value!)}>
                      {vehicleOptionOptions.map(vo => <IonSelectOption key={vo.type} value={vo.type}>{vo.type}</IonSelectOption>)}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput value={description} placeholder="Description" onIonChange={e => setDescription(e.detail.value!)} />
                  </IonItem>
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <input multiple className='image-input' type='file' id='image-input' />
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
                  if (make !== '' && model !== '' && mileage !== '' && price !== '' && year !== '' && capacity !== '' && transmission !== '' && color !== '' && powertrain !== '' && vehicleType !== '') {
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